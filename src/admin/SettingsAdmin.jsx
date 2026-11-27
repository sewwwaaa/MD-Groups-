import { useState } from "react";
import Loading from "../components/Loading.jsx";
import { api } from "../api.js";
import { useSiteData } from "../context/SiteData.jsx";

const FIELDS = [
  { key: "name", label: "Company name" },
  { key: "phone", label: "Phone number", placeholder: "071 123 4567" },
  { key: "phone2", label: "Second phone number (optional)", placeholder: "072 123 4567" },
  { key: "whatsapp", label: "WhatsApp number (digits only, with country code)", placeholder: "94771234567" },
  { key: "email", label: "Email address" },
  { key: "address", label: "Office address (also used for the map)" },
  { key: "hours", label: "Opening hours" },
  { key: "facebook", label: "Facebook page link", placeholder: "https://facebook.com/…" },
  { key: "instagram", label: "Instagram link", placeholder: "https://instagram.com/…" },
  { key: "linkedin", label: "LinkedIn link", placeholder: "https://linkedin.com/company/…" },
];

export default function SettingsAdmin({ onAuthError }) {
  const { settings, loading } = useSiteData();
  if (loading) return <Loading />;
  return <SettingsForm initial={settings} onAuthError={onAuthError} />;
}

function SettingsForm({ initial, onAuthError }) {
  const { reload } = useSiteData();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await api("/admin/settings", { method: "PUT", body: form, auth: true });
      await reload();
      setStatus("saved");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setStatus(err.message);
    }
  };

  return (
    <form onSubmit={save}>
      <div className="admin__head">
        <div>
          <h1>Settings</h1>
          <p className="muted">Contact details shown across the whole website.</p>
        </div>
        <div className="admin__actions">
          {status === "saved" && <span className="ok-text">✓ Saved</span>}
          <button className="btn btn--gold btn--sm" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save settings"}</button>
        </div>
      </div>
      {status && !["saving", "saved"].includes(status) && <p className="form-error panel-error">{status}</p>}
      <div className="panel">
        <div className="form-grid">
          {FIELDS.map((f) => (
            <label key={f.key} className="field">
              <span>{f.label}</span>
              <input value={form[f.key] || ""} placeholder={f.placeholder}
                onChange={(e) => { setForm({ ...form, [f.key]: e.target.value }); setStatus(""); }} />
            </label>
          ))}
        </div>
      </div>
    </form>
  );
}
