import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import SectionHead from "../components/SectionHead.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import { services } from "../data/site.js";

const faqs = [
  {
    q: "How much commission do you charge?",
    a: "Our commission depends on the type and value of the property. We always agree it with you in writing before we start, so there are no surprises.",
  },
  {
    q: "Do you help with legal checks and deeds?",
    a: "Yes. We work with trusted lawyers and surveyors who check title deeds, approved plans and boundaries before you commit.",
  },
  {
    q: "Can you help me sell my vehicle?",
    a: "Yes. We value your vehicle fairly, list it, bring genuine buyers and help with the ownership transfer at the RMV.",
  },
  {
    q: "Which areas do you cover?",
    a: "We mainly work in Colombo, Gampaha, Kandy and Galle districts, and can help with other areas on request.",
  },
  {
    q: "Is the first consultation really free?",
    a: "Yes. Talk to us about what you need and we will give you honest advice, with no obligation.",
  },
];

export default function Services() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Professional, end-to-end property services for buyers, sellers, landlords, tenants and investors."
      />

      <section className="section">
        <div className="container service-list">
          {services.map((s, i) => (
            <article key={s.title} className={`service-row ${i % 2 ? "service-row--alt" : ""}`}>
              <div className="service-row__icon"><Icon name={s.icon} size={40} /></div>
              <div>
                <h2>{s.title}</h2>
                <p className="muted">{s.short}</p>
                <ul className="checklist checklist--2col">
                  {s.points.map((pt) => (
                    <li key={pt}><Icon name="check" size={18} /> {pt}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container narrow">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
