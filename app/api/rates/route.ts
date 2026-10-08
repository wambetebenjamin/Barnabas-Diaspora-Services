import { NextRequest } from "next/server";
import { getRates } from "@/lib/rates";
import { setLastSnapshot, broadcast } from "@/lib/live-bus";

export const dynamic = "force-dynamic";

/** /api/rates — exchange rate fetch + cache (ExchangeRate-API with fallback board). */
export async function GET(request: NextRequest) {
  const refresh = request.nextUrl.searchParams.get("refresh") === "1";
  const snapshot = await getRates(refresh);
  setLastSnapshot(snapshot);
  if (refresh) {
    broadcast({ type: "rates", snapshot, presence: 1 });
  }
  return Response.json(
    {
      ok: true,
      base: snapshot.base,
      rates: snapshot.rates,
      updatedAt: snapshot.updatedAt,
      source: snapshot.source,
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } },
  );
}
