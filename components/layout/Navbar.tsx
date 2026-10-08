"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Send,
  Globe,
  TrendingUp,
  Building,
  FileText,
  Landmark,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { CURRENCIES, NAV_LINKS, type CurrencyCode } from "@/lib/design";
import { useRates } from "@/components/providers/AppProviders";

const NAV_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home: Globe,
  "Send Money": Send,
  Invest: TrendingUp,
  Property: Building,
  Services: FileText,
  Contact: Landmark,
};

/**
 * Sticky navbar — EFFECT-10 (logo animates once, replays on click),
 * EFFECT-11 (icon micro-animations 180–420ms), EFFECT-28 (glass on scroll,
 * blur max 20px, solid fallback, focus rings stay visible over blur).
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoKey, setLogoKey] = useState(0);
  const { currency, setCurrency, secondsAgo } = useRates();
  const firstRender = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45); // zip threshold
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header>
      {/* zip top bar */}
      <div className="topbar desktop-only">
        <div className="container">
          <span>Nairobi · London diaspora desk · Mon–Sat 8:00–20:00 EAT</span>
          <span>
            Rates updated {secondsAgo <= 1 ? "just now" : `${secondsAgo} seconds ago`} · WhatsApp
            +254 112 272 061
          </span>
        </div>
      </div>

      <nav className={`navbar${scrolled ? " is-scrolled" : ""}`} aria-label="Primary">
        <div className="container navbar-inner">
          {/* EFFECT-10: brand animates once on load, replays on click */}
          <Link
            href="/"
            className="brand"
            aria-label="Barnabas Diaspora Services Home"
            onClick={() => setLogoKey((k) => k + 1)}
          >
            <span className="brand-mark" key={logoKey} aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 48 48" className="logo-svg">
                <circle cx="24" cy="24" r="21" fill="#355efc" />
                <path
                  d="M14 34 V14 h10 a7 7 0 0 1 0 14 h-10 m10 0 h3 a7 7 0 0 1 0 6 h-13"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <style>{`
                  .logo-svg { animation: logo-pop 620ms cubic-bezier(0.34, 1.4, 0.64, 1) 1; }
                  @keyframes logo-pop {
                    0% { transform: scale(0.72) rotate(-14deg); opacity: 0; }
                    60% { transform: scale(1.08) rotate(3deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0); }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .logo-svg { animation: none; }
                  }
                `}</style>
              </svg>
            </span>
            <span className="brand-name">
              Barnabas <span>Diaspora</span>
            </span>
          </Link>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => {
              const Icon = NAV_ICONS[link.label] ?? Globe;
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link${active ? " active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {/* EFFECT-11: icons animate 180–420ms on hover/focus */}
                    <Icon size={15} className="icon-anim" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-actions">
            <label className="sr-only" htmlFor="nav-currency">
              Sending currency
            </label>
            <select
              id="nav-currency"
              className="currency-select desktop-only"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.symbol}
                </option>
              ))}
            </select>

            <Link href="/send" className="btn btn-primary desktop-only">
              <Send size={15} className="icon-anim" />
              Send Money Now
              <ArrowRight size={14} className="icon-anim" />
            </Link>

            <Link href="/login" className="signin-link desktop-only">
              Sign In
            </Link>

            <button
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — EFFECT-21 doodle driven by aria-expanded */}
        <div id="mobile-menu" className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <svg
            className={`doodle${menuOpen ? " drawn" : ""}`}
            viewBox="0 0 300 40"
            aria-hidden="true"
            style={{ width: "100%", height: 34, marginBottom: 8 }}
          >
            <path
              className="arrow"
              style={{ ["--len" as string]: "320" }}
              d="M6 30 Q 60 6 120 22 T 230 18 Q 260 16 290 10"
              fill="none"
              stroke="#355efc"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M284 6 l8 4 -8 5" fill="none" stroke="#355efc" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((link) => {
              const Icon = NAV_ICONS[link.label] ?? Globe;
              return (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link">
                    <Icon size={16} className="icon-anim" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/login" className="nav-link">
                Sign In
              </Link>
            </li>
            <li style={{ marginTop: 12 }}>
              <label className="form-label" htmlFor="mobile-currency">
                Sending currency
              </label>
              <select
                id="mobile-currency"
                className="currency-select"
                style={{ width: "100%" }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.label}
                  </option>
                ))}
              </select>
            </li>
            <li style={{ marginTop: 12 }}>
              <Link href="/send" className="btn btn-primary" style={{ width: "100%" }}>
                <Send size={15} />
                Send Money Now
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
