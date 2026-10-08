import { NextRequest } from "next/server";
import { registerUser, issueOtp } from "@/lib/auth";
import { verifyCaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

/** /api/auth/register — account registration with reCAPTCHA v3 + OTP 2FA. */
export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    country?: string;
    captchaToken?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.name || !body.email || !body.password || body.password.length < 8) {
    return Response.json(
      { ok: false, error: "Name, email and a password of at least 8 characters are required." },
      { status: 400 },
    );
  }

  const captcha = await verifyCaptcha(body.captchaToken, "register");
  if (!captcha.success) {
    return Response.json({ ok: false, error: "Security check failed." }, { status: 403 });
  }

  const result = await registerUser({
    name: body.name,
    email: body.email,
    password: body.password,
    phone: body.phone,
    country: body.country,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 409 });
  }

  // 2FA OTP — emailed; in dev (no SMTP) the code is returned for the test UI
  const otp = await issueOtp(body.email);
  await sendMail({
    to: body.email,
    subject: "Your Barnabas verification code",
    text: `Your one-time verification code is ${otp.code}. It expires in 5 minutes.`,
  });

  return Response.json({
    ok: true,
    user: result.user,
    devOtp: process.env.SMTP_HOST ? undefined : otp.code,
  });
}
