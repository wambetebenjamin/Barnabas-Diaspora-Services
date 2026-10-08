import Link from "next/link";
import { Send } from "lucide-react";

/** 404 — EFFECT-17: liquid blob animation (bounded SVG filter, not on text). */
export default function NotFound() {
  return (
    <section className="error-page">
      <div className="error-blob" aria-hidden="true" />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <p className="eyebrow">404</p>
        <h1>This destination was not found.</h1>
        <p className="muted" style={{ maxWidth: "52ch", marginInline: "auto" }}>
          The page you are looking for may have moved, or the link is out of date. Your transfers and
          saved recipients are never affected.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 26 }}>
          <Link href="/send" className="btn btn-primary btn-lg">
            <Send size={16} className="icon-anim" />
            Return to Send Money
          </Link>
          <Link href="/" className="btn btn-outline btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
