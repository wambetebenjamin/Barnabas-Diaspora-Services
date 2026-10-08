import { NextRequest } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";
import { pushRecord } from "@/lib/store";
import { queueB2CPayment } from "@/lib/daraja";
import {
  queueWhatsApp,
  transferSenderMessage,
  transferRecipientMessage,
} from "@/lib/whatsapp";
import { sendTransferConfirmation } from "@/lib/mail";
import { convertToKES, computeFee, getRates } from "@/lib/rates";
import { formatKES, formatMoney, type CurrencyCode } from "@/lib/design";

export const dynamic = "force-dynamic";

type TransferBody = {
  amount: number;
  currency: CurrencyCode;
  speed: "instant" | "standard";
  recipient: { name: string; phone: string; relationship: string };
  payment: "bank" | "card" | "paypal";
  senderName: string;
  senderEmail: string;
  captchaToken?: string;
};

/**
 * /api/transfer — transfer initiation:
 * saves to Vercel KV, triggers exchange-rate conversion, queues the M-Pesa
 * B2C payment via Daraja, sends WhatsApp + email confirmations to the sender
 * and a WhatsApp notification to the recipient. reCAPTCHA v3 verified
 * server-side.
 */
export async function POST(request: NextRequest) {
  let body: TransferBody;
  try {
    body = (await request.json()) as TransferBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 15000) {
    return Response.json(
      { ok: false, error: "Amount must be between 1 and 15,000 in your sending currency." },
      { status: 400 },
    );
  }
  if (!body.recipient?.name || !body.recipient?.phone) {
    return Response.json(
      { ok: false, error: "Recipient name and M-Pesa number are required." },
      { status: 400 },
    );
  }

  const captcha = await verifyCaptcha(body.captchaToken, "transfer");
  if (!captcha.success) {
    return Response.json(
      { ok: false, error: "Security check failed — please refresh and try again." },
      { status: 403 },
    );
  }

  const rates = await getRates();
  const fee = computeFee(amount, body.speed ?? "instant");
  const kes = convertToKES(amount - fee, body.currency ?? "GBP", rates);
  const reference = `BDS-${Date.now().toString(36).toUpperCase()}`;

  const record = {
    reference,
    amount,
    currency: body.currency,
    fee,
    kes,
    speed: body.speed,
    payment: body.payment,
    recipient: body.recipient,
    senderName: body.senderName,
    senderEmail: body.senderEmail,
    rate: rates.rates[body.currency ?? "GBP"],
    rateSource: rates.source,
    captchaMethod: captcha.method,
    status: "initiated",
  };

  await pushRecord("transfers", record as unknown as Record<string, unknown>);

  // Queue M-Pesa B2C payout
  const payout = await queueB2CPayment({
    reference,
    phone: body.recipient.phone,
    amountKES: kes,
    recipientName: body.recipient.name,
  });

  // WhatsApp notifications — sender and recipient
  await queueWhatsApp({
    to: body.senderEmail,
    kind: "transfer-sender",
    body: transferSenderMessage(
      body.senderName || "there",
      reference,
      formatKES(kes),
    ),
  });
  await queueWhatsApp({
    to: body.recipient.phone,
    kind: "transfer-recipient",
    body: transferRecipientMessage(body.recipient.name, formatKES(kes), body.senderName || "your sender"),
  });

  // Email confirmation to sender
  await sendTransferConfirmation({
    senderEmail: body.senderEmail || "sender@example.com",
    senderName: body.senderName || "there",
    reference,
    amountText: formatMoney(amount, body.currency ?? "GBP"),
    recipientName: body.recipient.name,
    recipientPhone: body.recipient.phone,
    kesText: formatKES(kes),
  });

  return Response.json({
    ok: true,
    reference,
    status: payout.status,
    conversationId: payout.conversationId,
    recipientGets: kes,
    fee,
    rate: rates.rates[body.currency ?? "GBP"],
  });
}
