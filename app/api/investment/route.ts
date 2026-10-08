import { NextRequest } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";
import { pushRecord } from "@/lib/store";
import { queueWhatsApp, waLink } from "@/lib/whatsapp";
import { WHATSAPP_INVEST_TEXT } from "@/lib/design";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

/** /api/investment — investment enquiry: save + notify (WhatsApp + desk email). */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.name || !body.email) {
    return Response.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const captcha = await verifyCaptcha(body.captchaToken as string | undefined, "investment");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  const record = await pushRecord("investment-enquiries", {
    ...body,
    captchaMethod: captcha.method,
    status: "new",
  });

  await queueWhatsApp({
    to: String(body.phone ?? "desk"),
    kind: "support",
    body: `Investment enquiry from ${body.name} (${body.email}) re: ${body.product ?? "general"}. ${waLink(WHATSAPP_INVEST_TEXT)}`,
  });

  await sendMail({
    to: "invest@barnabasdiaspora.co.ke",
    subject: `Investment enquiry — ${body.name}`,
    text: `New investment enquiry:\n\n${JSON.stringify(body, null, 2)}`,
  });

  return Response.json({ ok: true, id: record.id });
}
