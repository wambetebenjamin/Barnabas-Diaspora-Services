import { NextRequest } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";
import { pushRecord, getRecord } from "@/lib/store";

export const dynamic = "force-dynamic";

/** /api/newsletter — Vercel KV subscriber list + reCAPTCHA v3. */
export async function POST(request: NextRequest) {
  let body: { email?: string; country?: string; captchaToken?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ ok: false, error: "A valid email address is required." }, { status: 400 });
  }

  const captcha = await verifyCaptcha(body.captchaToken, "newsletter");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  const existing = await getRecord("subscribers", email);
  if (existing) {
    return Response.json({ ok: true, alreadySubscribed: true });
  }

  await pushRecord("subscribers", { email, country: body.country ?? "" });
  return Response.json({ ok: true });
}
