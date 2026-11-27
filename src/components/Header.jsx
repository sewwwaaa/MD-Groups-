import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { useSiteData } from "../context/SiteData.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/properties", label: "Properties" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About Us" },
];

export default function Header() {
  const { settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open || !isHome;

  return (
    <header className={`header ${solid ? "header--solid" : ""}`}>
      <div className="topbar">
        <div className="container topbar__inner">
          {settings.phone && <span><Icon name="phone" size={14} /> {[settings.phone, settings.phone2].filter(Boolean).join(" / ")}</span>}
          {settings.email && <span><Icon name="mail" size={14} /> {settings.email}</span>}
          {settings.hours && <span className="topbar__hours"><Icon name="clock" size={14} /> {settings.hours}</span>}
        </div>
      </div>
      <div className="container nav">
        <Link to="/" aria-label={`${settings.name} home`} onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <button
          className="nav__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>

        <nav
          className={`nav__links ${open ? "is-open" : ""}`}
          onClick={(e) => e.target.closest("a") && setOpen(false)}
        >
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="nav__link">
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn--gold btn--sm">Contact Us</Link>
        </nav>
      </div>
    </header>
  );
}
