/** Google reCAPTCHA — v3 scoring with v2 fallback below 0.5 (server-side). */

export type CaptchaResult = {
  success: boolean;
  score?: number;
  action?: string;
  /** "v3" | "v2" | "dev-bypass" */
  method: string;
  reason?: string;
};

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Verifies a reCAPTCHA token server-side. When secrets are not configured
 * (local preview), a documented dev-bypass is returned so flows remain testable.
 */
export async function verifyCaptcha(
  token: string | undefined,
  expectedAction?: string,
): Promise<CaptchaResult> {
  const v3Secret = process.env.RECAPTCHA_SECRET_KEY;
  const v2Secret = process.env.RECAPTCHA_V2_SECRET_KEY;

  if (!v3Secret && !v2Secret) {
    return { success: true, method: "dev-bypass", reason: "RECAPTCHA secrets not configured" };
  }

  if (!token) return { success: false, method: "v3", reason: "missing token" };

  try {
    const body = new URLSearchParams({ secret: v3Secret ?? v2Secret!, response: token });
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!json.success) {
      return {
        success: false,
        method: "v3",
        reason: json["error-codes"]?.join(",") ?? "verification failed",
      };
    }

    const score = json.score ?? 1;
    const actionOk = !expectedAction || json.action === expectedAction;

    // v3 tokens carry a score; below 0.5 we demand a v2 challenge token instead.
    if (score < 0.5) {
      return {
        success: false,
        score,
        method: "v3",
        action: json.action,
        reason: "score below 0.5 — v2 fallback required",
      };
    }

    return { success: actionOk, score, method: "v3", action: json.action };
  } catch (err) {
    return { success: false, method: "v3", reason: (err as Error).message };
  }
}
