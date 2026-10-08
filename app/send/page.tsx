import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { TransferFlow } from "@/components/transfer/TransferFlow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Send Money to Kenya",
  description:
    "Start a secure transfer to Kenya: live rates, M-Pesa payouts in minutes, and WhatsApp confirmations for both sides.",
  robots: { index: false, follow: false },
};

/** Transfer initiation flow — SSR only, no caching, authenticated (middleware too). */
export default async function SendPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/send");

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: "#9db4ff", borderColor: "rgba(255,255,255,0.25)" }}>
            Transfer initiation
          </span>
          <h1>Send money home with confidence</h1>
          <p>
            Signed in as {session.name || session.email}. Five steps: amount, recipient, payment,
            KYC and review — M-Pesa payout queued the moment you confirm.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <TransferFlow userName={session.name} userEmail={session.email} />
        </div>
      </section>
    </>
  );
}
