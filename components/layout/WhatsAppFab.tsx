import { MessageCircle } from "lucide-react";
import { WHATSAPP_HREF } from "@/lib/design";

/** Floating WhatsApp button — pulses every 10 seconds (CSS), tooltip on hover/focus. */
export function WhatsAppFab() {
  return (
    <a
      className="whatsapp-fab"
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Send money or enquire about investments on WhatsApp"
    >
      <span className="tooltip" role="tooltip">
        Send money or enquire about investments
      </span>
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  );
}
