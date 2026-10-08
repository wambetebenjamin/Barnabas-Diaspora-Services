import { NextRequest } from "next/server";
import { PROPERTIES } from "@/lib/data";
import { verifyCaptcha } from "@/lib/recaptcha";
import { pushRecord, listRecords } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * /api/property — listings (Vercel KV-backed with the curated fallback set)
 * and property enquiries (reCAPTCHA v3).
 */
export async function GET() {
  const overrides = await listRecords("property-listings");
  const listings = [...PROPERTIES.map((p) => ({ ...p, source: "seed" })), ...overrides];
  return Response.json(
    { ok: true, count: listings.length, listings },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } },
  );
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.name || !body.email || !body.slug) {
    return Response.json(
      { ok: false, error: "Name, email and property slug are required." },
      { status: 400 },
    );
  }

  const captcha = await verifyCaptcha(body.captchaToken as string | undefined, "property");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  const record = await pushRecord("property-enquiries", { ...body, captchaMethod: captcha.method });
  return Response.json({ ok: true, id: record.id });
}
