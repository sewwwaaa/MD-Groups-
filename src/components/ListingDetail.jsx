import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import PropertyImage from "./PropertyImage.jsx";
import { formatPrice } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";

// Shared layout for a single property or vehicle page.
export default function ListingDetail({ item, badge, subtitle, facts, backTo, backLabel, similar, similarTitle, renderCard }) {
  const { settings } = useSiteData();
  const waText = encodeURIComponent(`Hi, I'm interested in "${item.title}" (ref ${item.id}). Please send me more details.`);

  return (
    <>
      <section className="detail-top">
        <div className="container">
          <Link to={backTo} className="back-link"><Icon name="back" size={18} /> {backLabel}</Link>
          <div className="detail-head">
            <div>
              <span className={`badge badge--static ${item.deal === "rent" ? "badge--gold" : ""}`}>{badge}</span>
              <h1>{item.title}</h1>
              <p className="detail-loc">{subtitle}</p>
            </div>
            <p className="detail-price">{formatPrice(item)}</p>
          </div>
          <div className="detail-media">
            <PropertyImage property={item} />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container detail-layout">
          <div>
            <div className="facts">
              {facts.filter((f) => f.value).map((f) => (
                <div key={f.label} className="fact">
                  <Icon name={f.icon} size={22} />
                  <span>{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}
            </div>

            {item.description && (
              <>
                <h2 className="detail-h2">Description</h2>
                <p className="muted lead-text">{item.description}</p>
              </>
            )}

            {item.features?.length > 0 && (
              <>
                <h2 className="detail-h2">Features</h2>
                <ul className="features">
                  {item.features.map((f) => <li key={f}><Icon name="check" size={18} /> {f}</li>)}
                </ul>
              </>
            )}
          </div>

          <aside className="enquiry-card">
            <h3>Interested?</h3>
            <p>Contact us to arrange a viewing or get more details.</p>
            <Link to={`/contact?about=${encodeURIComponent(item.title)}`} className="btn btn--gold btn--block">
              Send an Enquiry
            </Link>
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--block">
                <Icon name="whatsapp" size={18} /> WhatsApp Us
              </a>
            )}
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn btn--outline btn--block">
                <Icon name="phone" size={18} /> {settings.phone}
              </a>
            )}
            <p className="enquiry-card__ref">Reference: {item.id.toUpperCase()}</p>
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <h2 className="detail-h2">{similarTitle}</h2>
            <div className="grid grid--3">{similar.map(renderCard)}</div>
          </div>
        </section>
      )}
    </>
  );
}
