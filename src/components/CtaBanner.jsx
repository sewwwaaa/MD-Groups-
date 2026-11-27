import { Link } from "react-router-dom";
import { useSiteData } from "../context/SiteData.jsx";

export default function CtaBanner() {
  const { settings } = useSiteData();
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2>Ready to buy, sell or rent?</h2>
          <p>Talk to Dineth or Madusha today about a property or vehicle. The first consultation is free.</p>
        </div>
        <div className="cta__actions">
          <Link to="/contact" className="btn btn--gold">Book a Consultation</Link>
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn btn--ghost">Call {settings.phone}</a>
          )}
        </div>
      </div>
    </section>
  );
}
