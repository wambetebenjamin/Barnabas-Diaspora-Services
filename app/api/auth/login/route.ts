import { NextRequest } from "next/server";
import { verifyCredentials, issueOtp, verifyOtp } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { verifyCaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

/**
 * /api/auth/login — credentials + 2FA OTP.
 * POST { email, password, otp? }. Without otp a code is issued; with otp the
 * session cookie is created.
 */
export async function POST(request: NextRequest) {
  let body: {
    email?: string;
    password?: string;
    otp?: string;
    captchaToken?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.email || !body.password) {
    return Response.json({ ok: false, error: "Email and password are required." }, { status: 400 });
  }

  const captcha = await verifyCaptcha(body.captchaToken, "login");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  const result = await verifyCredentials(body.email, body.password);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 401 });
  }

  if (!body.otp) {
    const otp = await issueOtp(body.email);
    await sendMail({
      to: body.email,
      subject: "Your Barnabas sign-in code",
      text: `Your one-time sign-in code is ${otp.code}. It expires in 5 minutes.`,
    });
    return Response.json({
      ok: true,
      otpRequired: true,
      devOtp: process.env.SMTP_HOST ? undefined : otp.code,
    });
  }

  const valid = await verifyOtp(body.email, body.otp);
  if (!valid) {
    return Response.json(
      { ok: false, error: "Invalid or expired verification code." },
      { status: 401 },
    );
  }

  await createSession({
    sub: result.user.id,
    email: result.user.email,
    name: result.user.name,
  });

  return Response.json({ ok: true, user: { email: result.user.email, name: result.user.name } });
}
