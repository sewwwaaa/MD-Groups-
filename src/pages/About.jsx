import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import SectionHead from "../components/SectionHead.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import VideoSection from "../components/VideoSection.jsx";
import { useSiteData } from "../context/SiteData.jsx";

const values = [
  { icon: "shield", title: "Honesty", text: "We tell you the truth about a property or vehicle, even when it is not what you want to hear." },
  { icon: "users", title: "Personal service", text: "Every client deals directly with the directors, from first call to final signature." },
  { icon: "file", title: "Transparency", text: "Clear fees, clear documents and clear communication at every step." },
  { icon: "chart", title: "Market knowledge", text: "We know the areas, the prices and the people, so you get the right deal." },
];

export default function About() {
  const { team } = useSiteData();

  return (
    <>
      <PageHero
        title="About Us"
        subtitle="A young Sri Lankan property and vehicle company built on honesty and personal service."
      />

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead align="left" eyebrow="Our story" title="Why we started MD Groups" />
            <p className="muted">
              Dineth Sewmina and Madusha Weerakoon saw how stressful buying and selling property and vehicles in Sri Lanka
              could be: unclear prices, unverified listings, hidden fees and agents who disappear once
              the deal is done.
            </p>
            <p className="muted">
              They started MD Groups to do things differently. Every listing is checked. Every fee is
              agreed up front. And every client gets the directors' personal attention, because for a
              young company, our reputation is everything.
            </p>
          </div>
          <div className="mission">
            <div>
              <h3>Our mission</h3>
              <p>To make property and vehicle transactions in Sri Lanka simple, honest and stress-free.</p>
            </div>
            <div>
              <h3>Our vision</h3>
              <p>To become the most trusted property and vehicle company in Sri Lanka, one happy client at a time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHead eyebrow="Leadership" title="Meet our directors" />
          <div className="founders">
            {team.map((m, i) => (
              <article key={m.id} className="founder">
                <div className="founder__photo">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy" />
                  ) : (
                    <div className={`founder__initial ${i % 2 ? "founder__initial--gold" : ""}`}>
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="founder__body">
                  <h3>{m.name}</h3>
                  <p className="founder__role">{m.role}</p>
                  <p className="muted">{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <VideoSection compact />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="What we stand for" title="Our values" />
          <div className="grid grid--4">
            {values.map((v) => (
              <article key={v.title} className="service">
                <div className="service__icon"><Icon name={v.icon} size={26} /></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
