import { SITE } from "./design";
import { pushRecord } from "./store";

export type WhatsAppNotification = {
  to: string;
  body: string;
  kind: "transfer-sender" | "transfer-recipient" | "chama" | "support";
};

/**
 * Queues a WhatsApp notification. Without a WhatsApp Business API key the
 * notification is logged and persisted so operators can send it manually —
 * the production shape is identical to the Cloud API call.
 */
export async function queueWhatsApp(notification: WhatsAppNotification): Promise<void> {
  await pushRecord("whatsapp-outbox", { ...notification, queuedAt: Date.now() });
  console.info(`[whatsapp:${notification.kind}] to=${notification.to} "${notification.body.slice(0, 80)}"`);
}

export function transferSenderMessage(name: string, reference: string, kesText: string): string {
  return `Hello ${name}, your transfer ${reference} is confirmed. Recipient receives ${kesText} via M-Pesa. — Barnabas Diaspora Services`;
}

export function transferRecipientMessage(name: string, kesText: string, senderName: string): string {
  return `Hello ${name}, you have received ${kesText} from ${senderName} via Barnabas Diaspora Services. — Barnabas Diaspora Services`;
}

export function chamaRegisteredMessage(chamaName: string): string {
  return `Thank you! Chama "${chamaName}" registration received. Our diaspora desk will contact the lead shortly. — Barnabas Diaspora Services`;
}

/** Public wa.me deep link used by floating buttons and CTAs. */
export function waLink(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
