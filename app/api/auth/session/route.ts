import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ ok: true, user: null });
  return Response.json({ ok: true, user: { email: session.email, name: session.name, sub: session.sub } });
}
