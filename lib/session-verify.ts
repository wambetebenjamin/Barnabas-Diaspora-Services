import { jwtVerify } from "jose";

/** Edge-safe session verification (no next/headers) — used by middleware.ts. */
const COOKIE = "bds_session";

function secret(): Uint8Array {
  const raw = process.env.AUTH_SECRET || "barnabas-diaspora-dev-secret-change-in-production";
  return new TextEncoder().encode(raw);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE;
