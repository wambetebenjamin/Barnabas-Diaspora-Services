import { NextRequest } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";
import { pushRecord } from "@/lib/store";
import { queueWhatsApp, chamaRegisteredMessage } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/** /api/chama — chama registration: save + WhatsApp notify. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.chamaName || !body.country || !body.leadEmail || !body.leadPhone) {
    return Response.json(
      { ok: false, error: "Chama name, country and lead contact details are required." },
      { status: 400 },
    );
  }

  const captcha = await verifyCaptcha(body.captchaToken as string | undefined, "chama");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  const record = await pushRecord("chamas", { ...body, captchaMethod: captcha.method });

  await queueWhatsApp({
    to: String(body.leadPhone),
    kind: "chama",
    body: chamaRegisteredMessage(String(body.chamaName)),
  });

  return Response.json({ ok: true, id: record.id });
}
