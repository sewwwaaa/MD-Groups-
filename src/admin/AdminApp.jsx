import { useCallback, useState } from "react";
import { Routes, Route, NavLink, Navigate, Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Logo from "../components/Logo.jsx";
import { api, getToken, setToken } from "../api.js";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import ListingsAdmin from "./ListingsAdmin.jsx";
import ListingEditor from "./ListingEditor.jsx";
import Enquiries from "./Enquiries.jsx";
import TeamAdmin from "./TeamAdmin.jsx";
import SettingsAdmin from "./SettingsAdmin.jsx";

const nav = [
  { to: "/admin", label: "Dashboard", icon: "grid", end: true },
  { to: "/admin/properties", label: "Properties", icon: "home" },
  { to: "/admin/vehicles", label: "Vehicles", icon: "car" },
  { to: "/admin/enquiries", label: "Enquiries", icon: "inbox" },
  { to: "/admin/team", label: "Directors", icon: "users" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(Boolean(getToken()));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try { await api("/admin/logout", { method: "POST", auth: true }); } catch { /* ignore */ }
    setToken(null);
    setLoggedIn(false);
    navigate("/admin");
  };

  // Any 401 from a page sends the user back to the login screen.
  const onAuthError = useCallback(() => { setToken(null); setLoggedIn(false); }, []);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const pageProps = { onAuthError };

  return (
    <div className="admin">
      <aside className={`admin__side ${menuOpen ? "is-open" : ""}`}>
        <Link to="/admin" className="admin__brand" onClick={() => setMenuOpen(false)}>
          <Logo />
          <span>Admin Portal</span>
        </Link>
        <nav onClick={(e) => e.target.closest("a") && setMenuOpen(false)}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="admin__link">
              <Icon name={n.icon} size={19} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin__side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin__link">
            <Icon name="external" size={19} /> View website
          </a>
          <button className="admin__link" onClick={logout}>
            <Icon name="logout" size={19} /> Log out
          </button>
        </div>
      </aside>

      <div className="admin__main">
        <header className="admin__top">
          <button className="admin__burger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>
          <span className="admin__hello"><Icon name="user" size={18} /> Logged in as admin</span>
        </header>
        <div className="admin__content">
          <Routes>
            <Route index element={<Dashboard {...pageProps} />} />
            <Route path="properties" element={<ListingsAdmin kind="properties" {...pageProps} />} />
            <Route path="properties/new" element={<ListingEditor kind="properties" {...pageProps} />} />
            <Route path="properties/:id" element={<ListingEditor kind="properties" {...pageProps} />} />
            <Route path="vehicles" element={<ListingsAdmin kind="vehicles" {...pageProps} />} />
            <Route path="vehicles/new" element={<ListingEditor kind="vehicles" {...pageProps} />} />
            <Route path="vehicles/:id" element={<ListingEditor kind="vehicles" {...pageProps} />} />
            <Route path="enquiries" element={<Enquiries {...pageProps} />} />
            <Route path="team" element={<TeamAdmin {...pageProps} />} />
            <Route path="settings" element={<SettingsAdmin {...pageProps} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
      {menuOpen && <div className="admin__overlay" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}
