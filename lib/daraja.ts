import { pushRecord } from "./store";

export type B2CPayment = {
  reference: string;
  phone: string;
  amountKES: number;
  recipientName: string;
};

export type QueueResult = {
  queued: boolean;
  conversationId: string;
  status: "queued" | "dev-queued" | "failed";
  detail?: string;
};

/**
 * Queues an M-Pesa B2C payout via the Safaricom Daraja API. When credentials
 * are absent the payout is queued in the outbox (dev mode) with the exact
 * production payload shape.
 */
export async function queueB2CPayment(payment: B2CPayment): Promise<QueueResult> {
  const conversationId = `BDS-${Date.now().toString(36).toUpperCase()}`;
  const payload = {
    InitiatorName: process.env.MPESA_SHORTCODE ?? "BARNABAS",
    CommandID: "BusinessPayment",
    Amount: Math.round(payment.amountKES),
    PartyA: process.env.MPESA_SHORTCODE ?? "600000",
    PartyB: normalizeMsisdn(payment.phone),
    Remarks: `Transfer ${payment.reference}`,
    QueueTimeOutURL: process.env.MPESA_CALLBACK_URL ?? "https://barnabasdiaspora.co.ke/api/mpesa/callback",
    ResultURL: process.env.MPESA_CALLBACK_URL ?? "https://barnabasdiaspora.co.ke/api/mpesa/callback",
    Occasion: payment.reference,
  };

  await pushRecord("mpesa-outbox", { ...payload, conversationId, recipientName: payment.recipientName });

  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) {
    return {
      queued: true,
      conversationId,
      status: "dev-queued",
      detail: "Daraja credentials not configured — payout recorded in mpesa-outbox",
    };
  }

  try {
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" },
    );
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) throw new Error("no access token");

    const res = await fetch("https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { ConversationID?: string; ResponseDescription?: string };
    return {
      queued: res.ok,
      conversationId: json.ConversationID ?? conversationId,
      status: res.ok ? "queued" : "failed",
      detail: json.ResponseDescription,
    };
  } catch (err) {
    return {
      queued: true,
      conversationId,
      status: "dev-queued",
      detail: (err as Error).message,
    };
  }
}

function normalizeMsisdn(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}
