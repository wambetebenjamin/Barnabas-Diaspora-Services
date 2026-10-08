"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", padding: 48, textAlign: "center" }}>
        <h1>Our transfer system is temporarily offline.</h1>
        <h2 style={{ color: "#355efc" }}>Your funds are safe. Please try again shortly.</h2>
        <p>
          WhatsApp support: <strong>+254 112 272 061</strong>
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            minHeight: 48,
            padding: "12px 28px",
            background: "#355efc",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
