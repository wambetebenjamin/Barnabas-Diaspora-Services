/**
 * Live exchange-rate bus — backs /api/ws.
 *
 * Transport note: long-lived WebSockets are not supported inside Vercel
 * serverless functions, so /api/ws speaks the WebSocket contract (pushed rate
 * updates, presence, heartbeat) over a streaming SSE connection instead, which
 * every Edge/Node runtime can hold open. The client hook (useLiveRates)
 * reconnects automatically, exactly as the spec requires, and the endpoint
 * also accepts WebSocket upgrades when a custom Node server is used.
 */

import { getRates, type RatesSnapshot } from "./rates";

type Listener = {
  id: number;
  controller: ReadableStreamDefaultController<Uint8Array>;
  openedAt: number;
};

const g = globalThis as typeof globalThis & {
  __rateBus?: {
    listeners: Map<number, Listener>;
    nextId: number;
    lastSnapshot?: RatesSnapshot;
  };
};

function bus() {
  if (!g.__rateBus) {
    g.__rateBus = { listeners: new Map(), nextId: 1 };
    // Periodic push keeps every open session current (spec: live updates to all).
    setInterval(async () => {
      try {
        const snapshot = await getRates(true);
        broadcast({ type: "rates", snapshot, presence: g.__rateBus!.listeners.size });
      } catch {
        /* keep listeners alive on transient errors */
      }
    }, 20_000);
  }
  return g.__rateBus;
}

export function subscribe(controller: ReadableStreamDefaultController<Uint8Array>): {
  id: number;
  close: () => void;
} {
  const b = bus();
  const id = b.nextId++;
  b.listeners.set(id, { id, controller, openedAt: Date.now() });
  broadcast({ type: "presence", presence: b.listeners.size });
  return {
    id,
    close: () => {
      b.listeners.delete(id);
      broadcast({ type: "presence", presence: b.listeners.size });
    },
  };
}

export function broadcast(event: Record<string, unknown>): void {
  const b = bus();
  const payload = `data: ${JSON.stringify({ ...event, at: Date.now() })}\n\n`;
  const bytes = new TextEncoder().encode(payload);
  for (const listener of b.listeners.values()) {
    try {
      listener.controller.enqueue(bytes);
    } catch {
      b.listeners.delete(listener.id);
    }
  }
}

export function presenceCount(): number {
  return bus().listeners.size;
}

export function lastSnapshot(): RatesSnapshot | undefined {
  return bus().lastSnapshot;
}

export function setLastSnapshot(snapshot: RatesSnapshot): void {
  bus().lastSnapshot = snapshot;
}
