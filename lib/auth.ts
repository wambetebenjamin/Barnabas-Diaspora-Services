import { createHash, randomInt, scryptSync, timingSafeEqual, randomBytes } from "node:crypto";
import { getRecord, saveRecord } from "./store";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  phone?: string;
  country?: string;
  createdAt: number;
  otp?: { code: string; expires: number };
  savedRecipients?: { name: string; phone: string; relationship: string }[];
};

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 32).toString("hex");
}

export async function registerUser(input: {
  email: string;
  name: string;
  password: string;
  phone?: string;
  country?: string;
}): Promise<{ ok: true; user: Omit<User, "passwordHash" | "salt"> } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const existing = await getRecord("users", email);
  if (existing) return { ok: false, error: "An account with this email already exists." };

  const salt = randomBytes(16).toString("hex");
  const user: User = {
    id: createHash("sha256").update(email).digest("hex").slice(0, 12),
    email,
    name: input.name.trim(),
    passwordHash: hashPassword(input.password, salt),
    salt,
    phone: input.phone,
    country: input.country,
    createdAt: Date.now(),
    savedRecipients: [],
  };
  await saveRecord("users", email, user as unknown as Record<string, unknown>);
  const { passwordHash, salt: _s, ...safe } = user;
  return { ok: true, user: safe };
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const user = (await getRecord("users", email.trim().toLowerCase())) as unknown as User | null;
  if (!user) return { ok: false, error: "Invalid email or password." };
  const candidate = hashPassword(password, user.salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(user.passwordHash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "Invalid email or password." };
  }
  return { ok: true, user };
}

/** 2FA OTP — six digits, five-minute TTL (logged in dev server output when no SMTP). */
export async function issueOtp(email: string): Promise<{ code: string; expires: number }> {
  const user = (await getRecord("users", email.trim().toLowerCase())) as unknown as User | null;
  const code = String(randomInt(100000, 1000000));
  const expires = Date.now() + 5 * 60 * 1000;
  if (user) {
    user.otp = { code, expires };
    await saveRecord("users", user.email, user as unknown as Record<string, unknown>);
  }
  return { code, expires };
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const user = (await getRecord("users", email.trim().toLowerCase())) as unknown as User | null;
  if (!user?.otp) return false;
  const ok = user.otp.code === code.trim() && user.otp.expires > Date.now();
  if (ok) {
    delete user.otp;
    await saveRecord("users", user.email, user as unknown as Record<string, unknown>);
  }
  return ok;
}
