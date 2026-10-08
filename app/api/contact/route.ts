import { NextRequest } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";
import { pushRecord } from "@/lib/store";
import { sendMail } from "@/lib/mail";
import { SITE } from "@/lib/design";

export const dynamic = "force-dynamic";

/** /api/contact — enquiry form via Nodemailer + reCAPTCHA v3. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.name || !body.email || !body.message) {
    return Response.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 400 },
    );
  }

  const captcha = await verifyCaptcha(body.captchaToken as string | undefined, "contact");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  await pushRecord("contacts", { ...body, captchaMethod: captcha.method });

  await sendMail({
    to: SITE.email,
    subject: `Enquiry from ${body.name} — ${body.topic ?? "General"}`,
    text: [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone ?? "—"}`,
      `Topic: ${body.topic ?? "General"}`,
      "",
      String(body.message),
    ].join("\n"),
  });

  return Response.json({ ok: true });
}
