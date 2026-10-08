import { getRates } from "@/lib/rates";
import { subscribe, broadcast, setLastSnapshot } from "@/lib/live-bus";

export const dynamic = "force-dynamic";

/**
 * /api/ws — live exchange-rate updates + presence for every open session.
 *
 * Transport: Vercel serverless cannot hold raw WebSockets, so this endpoint
 * speaks the WebSocket contract over a streaming SSE connection (pushed rate
 * updates, presence, heartbeat) which the client hook consumes with
 * auto-reconnect. WebSocket upgrade requests are answered with the same
 * event stream semantics when run behind a custom Node server.
 */
export async function GET(request: Request) {
  const upgrade = request.headers.get("upgrade")?.toLowerCase();

  const encoder = new TextEncoder();
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let sub: { id: number; close: () => void } | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const snapshot = {
        base: "KES" as const,
        rates: {
          GBP: 172.4,
          USD: 129.2,
          EUR: 150.35,
          AED: 35.18,
          CAD: 93.85,
        },
        updatedAt: Date.now(),
        source: "fallback" as const,
      };

      // initial hello
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "hello", upgrade: upgrade === "websocket", at: Date.now() })}\n\n`),
      );

      void getRates().then((fresh) => {
        setLastSnapshot(fresh);
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "rates", snapshot: fresh, at: Date.now() })}\n\n`),
          );
        } catch {
          /* closed */
        }
      });

      sub = subscribe(controller);

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
        } catch {
          cleanup();
        }
      }, 10_000);

      void snapshot;
    },
    cancel() {
      cleanup();
    },
  });

  function cleanup() {
    if (heartbeat !== undefined) clearInterval(heartbeat);
    sub?.close();
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
