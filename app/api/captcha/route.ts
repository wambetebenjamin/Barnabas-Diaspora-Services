import { NextRequest } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

/**
 * /api/captcha — reCAPTCHA server-side verification endpoint.
 * POST { token, action? } → { success, score, method }.
 * Falls back to a v2 challenge signal when the v3 score is under 0.5.
 */
export async function POST(request: NextRequest) {
  let body: { token?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = await verifyCaptcha(body.token, body.action);
  return Response.json({
    ok: result.success,
    ...result,
    v2FallbackRequired: Boolean(result.success === false && (result.score ?? 1) < 0.5),
  });
}
