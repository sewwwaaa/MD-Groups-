import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import SearchBar from "../components/SearchBar.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import SectionHead from "../components/SectionHead.jsx";
import CtaBanner from "../components/CtaBanner.jsx";
import VideoSection from "../components/VideoSection.jsx";
import Loading from "../components/Loading.jsx";
import { services } from "../data/site.js";
import { useSiteData } from "../context/SiteData.jsx";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=75";

const reasons = [
  { icon: "shield", title: "Verified listings", text: "We check every property, vehicle and its documents before we show it to you." },
  { icon: "coin", title: "Clear, fair fees", text: "Our commission is agreed in writing up front. No hidden charges, ever." },
  { icon: "file", title: "Paperwork handled", text: "Deeds, transfers and agreements, done with trusted legal partners." },
  { icon: "users", title: "Direct to the directors", text: "You deal with Dineth and Madusha personally, not a call centre." },
];

const steps = [
  { title: "Tell us what you need", text: "Call, WhatsApp or send a message with your budget and what you're looking for." },
  { title: "We search & verify", text: "We shortlist matching properties or vehicles and check the details and documents." },
  { title: "Inspect & decide", text: "We arrange viewings and test drives at times that suit you." },
  { title: "Close with confidence", text: "We negotiate the price and guide you through to the final transfer." },
];

const pickFeatured = (items, n) => {
  const featured = items.filter((x) => x.featured);
  return (featured.length ? featured : items).slice(0, n);
};

export default function Home() {
  const { properties, vehicles, team, loading } = useSiteData();
  const featuredProps = pickFeatured(properties, 3);
  const featuredVehicles = pickFeatured(vehicles, 3);
  const teamPhoto = team.find((m) => m.photo);

  return (
    <>
      <section className="hero" style={{ "--hero-img": `url(${HERO_IMAGE})` }}>
        <div className="container hero__inner">
          <p className="eyebrow eyebrow--light">Property &amp; Vehicle Solutions · Sri Lanka</p>
          <h1>
            Property or vehicle,<br />
            <em>we find the right deal.</em>
          </h1>
          <p className="hero__lead">
            Buy, sell or rent houses, land, apartments and vehicles across Sri Lanka, with honest
            advice from the first viewing to the final transfer.
          </p>
          <a href="#video" className="hero__video-link">
            <span><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
            <span>Watch our video</span>
          </a>
          <SearchBar />
        </div>
      </section>

      <section className="trust">
        <div className="container trust__grid">
          {reasons.map((r) => (
            <div key={r.title} className="trust__item">
              <Icon name={r.icon} size={26} />
              <div>
                <strong>{r.title}</strong>
                <span>{r.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section className="section">
        <div className="container">
          <div className="section-row">
            <SectionHead align="left" eyebrow="Featured properties" title="Handpicked homes, land & spaces" />
            <Link to="/properties" className="link-arrow">View all properties <Icon name="arrow" size={18} /></Link>
          </div>
          {loading ? <Loading /> : (
            <div className="grid grid--3">
              {featuredProps.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-row">
            <SectionHead align="left" eyebrow="Featured vehicles" title="Quality cars, SUVs & vans" />
            <Link to="/vehicles" className="link-arrow">View all vehicles <Icon name="arrow" size={18} /></Link>
          </div>
          {loading ? <Loading /> : (
            <div className="grid grid--3">
              {featuredVehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          )}
        </div>
      </section>

      <VideoSection />

      {/* Services */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="What we do"
            title="Complete property & vehicle services"
            text="Everything you need to buy, sell, rent or invest, handled by people who pick up the phone."
          />
          <div className="grid grid--auto">
            {services.map((s) => (
              <article key={s.title} className="service">
                <div className="service__icon"><Icon name={s.icon} size={26} /></div>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <Link to="/services" className="link-arrow link-arrow--sm">Learn more <Icon name="arrow" size={16} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="section section--alt">
        <div className="container split">
          <div className="split__media">
            <img
              src={teamPhoto ? teamPhoto.photo : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=75"}
              alt={teamPhoto ? teamPhoto.name : "Modern living room"}
              loading="lazy"
              className={teamPhoto ? "is-portrait" : ""}
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <div className="split__badge">
              <strong>2</strong>
              <span>Directors who handle<br />every deal personally</span>
            </div>
          </div>
          <div>
            <SectionHead align="left" eyebrow="About MD Groups" title="A new way to buy & sell" />
            <p className="muted">
              MD Groups was founded by <strong>Dineth Sewmina</strong> and <strong>Madusha Weerakoon</strong> with one
              simple idea: buying or selling property and vehicles in Sri Lanka should be honest,
              transparent and stress-free.
            </p>
            <ul className="checklist">
              <li><Icon name="check" size={18} /> Every listing checked before we show it</li>
              <li><Icon name="check" size={18} /> Commission agreed in writing up front</li>
              <li><Icon name="check" size={18} /> Help with deeds, vehicle transfers and legal checks</li>
              <li><Icon name="check" size={18} /> Available 7 days a week by phone and WhatsApp</li>
            </ul>
            <Link to="/about" className="btn btn--navy">Meet the directors</Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <SectionHead eyebrow="How it works" title="Four simple steps" />
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="steps__num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
