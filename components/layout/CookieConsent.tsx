"use client";

import { useEffect, useState } from "react";

type Consent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: number;
};

const STORAGE_KEY = "bds_cookie_consent";

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/**
 * Cookie consent banner + preferences modal.
 * Kenya Data Protection Act 2019 and GDPR compliant (UK/EU users).
 * Consent stored in localStorage — never shown again after a choice.
 */
export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<Omit<Consent, "necessary" | "decidedAt">>({
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Banner is SSR-visible for first-time/no-JS visitors; hide immediately
    // when a stored decision exists so returning users never see it again.
    const existing = readConsent();
    if (existing) {
      setConsent(existing);
      setShowBanner(false);
    }
  }, []);

  const persist = (next: Omit<Consent, "necessary" | "decidedAt">) => {
    const full: Consent = { necessary: true, ...next, decidedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    setConsent(full);
    setShowBanner(false);
    setShowModal(false);
  };

  if (consent || !showBanner) {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline"
          style={{ position: "fixed", left: 16, bottom: 16, zIndex: 940, fontSize: 11, minHeight: 40 }}
          onClick={() => {
            setDraft({
              functional: consent?.functional ?? true,
              analytics: consent?.analytics ?? false,
              marketing: consent?.marketing ?? false,
            });
            setShowModal(true);
          }}
        >
          Cookie settings
        </button>
        {showModal ? (
          <PreferencesModal
            draft={draft}
            setDraft={setDraft}
            onSave={() => persist(draft)}
            onClose={() => setShowModal(false)}
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
        <div className="container">
          <p>
            Barnabas Diaspora Services uses cookies to personalise your remittance experience and
            remember your settings. See our{" "}
            <a href="/legal/cookie-policy">Cookie Policy</a>. We process data under the Kenya Data
            Protection Act 2019 and the GDPR for our UK and EU users.
          </p>
          <div className="cookie-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => persist({ functional: true, analytics: true, marketing: true })}
            >
              Accept All
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                setDraft({ functional: true, analytics: false, marketing: false });
                setShowModal(true);
              }}
            >
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
      {showModal ? (
        <PreferencesModal
          draft={draft}
          setDraft={setDraft}
          onSave={() => persist(draft)}
          onClose={() => setShowModal(false)}
        />
      ) : null}
    </>
  );
}

function PreferencesModal({
  draft,
  setDraft,
  onSave,
  onClose,
}: {
  draft: { functional: boolean; analytics: boolean; marketing: boolean };
  setDraft: (d: { functional: boolean; analytics: boolean; marketing: boolean }) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="cookie-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Manage cookie preferences"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 22 }}>Manage Preferences</h2>
        <p className="muted" style={{ fontSize: 13 }}>
          Choose which cookies Barnabas may use. Necessary cookies keep the site and your session
          secure and cannot be switched off. You can change this at any time.
        </p>

        <div className="cookie-row">
          <div>
            <strong>Necessary</strong>
            <div className="meta">Security, session, fraud prevention — always on.</div>
          </div>
          <label className="switch">
            <input type="checkbox" checked disabled aria-label="Necessary cookies (always on)" />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>

        <div className="cookie-row">
          <div>
            <strong>Functional</strong>
            <div className="meta">Remembers currency, recipients and language preferences.</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={draft.functional}
              onChange={(e) => setDraft({ ...draft, functional: e.target.checked })}
              aria-label="Functional cookies"
            />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>

        <div className="cookie-row">
          <div>
            <strong>Analytics</strong>
            <div className="meta">Helps us understand how diaspora customers use the site.</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={draft.analytics}
              onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })}
              aria-label="Analytics cookies"
            />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>

        <div className="cookie-row" style={{ borderBottom: 0 }}>
          <div>
            <strong>Marketing</strong>
            <div className="meta">Rate alerts and investment offers relevant to you.</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={draft.marketing}
              onChange={(e) => setDraft({ ...draft, marketing: e.target.checked })}
              aria-label="Marketing cookies"
            />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>

        <div className="row" style={{ marginTop: 22 }}>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            Save preferences
          </button>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <a href="/legal/cookie-policy" className="meta">
            Read the Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}
