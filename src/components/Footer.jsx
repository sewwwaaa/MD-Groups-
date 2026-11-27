import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { services } from "../data/site.js";
import { useSiteData } from "../context/SiteData.jsx";

const YEAR = new Date().getFullYear();

export default function Footer() {
  const { settings } = useSiteData();
  const social = ["facebook", "instagram", "linkedin"].filter((k) => settings[k]);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo size="lg" />
          <p>
            Trusted property and vehicle solutions in Sri Lanka. Founded by Dineth Sewmina and
            Madusha Weerakoon to make buying, selling and renting simple.
          </p>
          {social.length > 0 && (
            <div className="social">
              {social.map((name) => (
                <a key={name} href={settings[name]} aria-label={name} target="_blank" rel="noopener noreferrer">
                  <Icon name={name} size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/vehicles">Vehicles</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            {services.map((s) => (
              <li key={s.title}><Link to="/services">{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Get in touch</h4>
          <ul className="footer__contact">
            {settings.phone && <li><Icon name="phone" size={16} /> <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></li>}
            {settings.phone2 && <li><Icon name="phone" size={16} /> <a href={`tel:${settings.phone2.replace(/\s/g, "")}`}>{settings.phone2}</a></li>}
            {settings.email && <li><Icon name="mail" size={16} /> <a href={`mailto:${settings.email}`}>{settings.email}</a></li>}
            {settings.address && <li><Icon name="pin" size={16} /> {settings.address}</li>}
            {settings.hours && <li><Icon name="clock" size={16} /> {settings.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {YEAR} {settings.name}. All rights reserved.</p>
        <p>Founded by Dineth Sewmina &amp; Madusha Weerakoon · <Link to="/admin">Staff login</Link></p>
      </div>
    </footer>
  );
}
