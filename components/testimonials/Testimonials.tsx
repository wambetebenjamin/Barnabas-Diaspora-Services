import { TESTIMONIALS } from "@/lib/data";
import { Reveal } from "@/components/effects/Reveal";

/** Testimonials — diaspora member cards, stagger reveal on scroll. */
export function Testimonials() {
  return (
    <section className="section" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Diaspora voices</span>
          <h2 id="testimonials-heading">Trusted by Kenyans around the world</h2>
        </div>

        <div className="grid-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={`${t.name}-${t.country}`} delay={i * 120}>
              <article className="testimonial-card">
                <p style={{ marginTop: 12 }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="row" style={{ justifyContent: "space-between", marginTop: 16 }}>
                  <strong>{t.name}</strong>
                  <span className="meta">{t.country}</span>
                </div>
                <span className="meta">{t.service}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
