import nodemailer from "nodemailer";
import { SITE } from "./design";

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ delivered: boolean; id: string }> {
  const id = `mail-${Date.now().toString(36)}`;
  if (!smtpConfigured) {
    console.info(`[mail:dev] to=${input.to} subject="${input.subject}"`);
    return { delivered: false, id };
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? `Barnabas Diaspora Services <no-reply@barnabasdiaspora.co.ke>`,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html ?? `<p>${input.text}</p>`,
  });
  return { delivered: true, id };
}

export async function sendTransferConfirmation(input: {
  senderEmail: string;
  senderName: string;
  reference: string;
  amountText: string;
  recipientName: string;
  recipientPhone: string;
  kesText: string;
}): Promise<void> {
  await sendMail({
    to: input.senderEmail,
    subject: `Transfer ${input.reference} confirmed — Barnabas Diaspora Services`,
    text: [
      `Dear ${input.senderName},`,
      "",
      `Your transfer ${input.reference} has been received and is being processed.`,
      `You sent ${input.amountText}. ${input.recipientName} (${input.recipientPhone}) will receive ${input.kesText} via M-Pesa.`,
      "",
      "You will receive a WhatsApp confirmation when the payout is queued.",
      "",
      "Barnabas Diaspora Services — " + SITE.url,
    ].join("\n"),
  });
}
