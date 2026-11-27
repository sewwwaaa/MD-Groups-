import { useState } from "react";
import Loading from "../components/Loading.jsx";
import { api } from "../api.js";
import { useSiteData } from "../context/SiteData.jsx";
import ImageUpload from "./ImageUpload.jsx";

export default function TeamAdmin({ onAuthError }) {
  const { team, loading } = useSiteData();

  return (
    <>
      <div className="admin__head">
        <div>
          <h1>Directors</h1>
          <p className="muted">Photos and details shown on the About Us page.</p>
        </div>
      </div>
      {loading ? <Loading /> : (
        <div className="team-grid">
          {team.map((m) => <MemberForm key={m.id} member={m} onAuthError={onAuthError} />)}
        </div>
      )}
    </>
  );
}

function MemberForm({ member, onAuthError }) {
  const { reload } = useSiteData();
  const [form, setForm] = useState(member);
  const [status, setStatus] = useState("");

  const set = (key, value) => { setForm((f) => ({ ...f, [key]: value })); setStatus(""); };

  const save = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await api(`/admin/team/${member.id}`, { method: "PUT", body: form, auth: true });
      await reload();
      setStatus("saved");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setStatus(err.message);
    }
  };

  return (
    <form className="panel member" onSubmit={save}>
      <ImageUpload round label="Photo" value={form.photo} onChange={(url) => set("photo", url)} onAuthError={onAuthError} />
      <label className="field"><span>Full name</span><input value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
      <label className="field"><span>Position</span><input value={form.role} onChange={(e) => set("role", e.target.value)} /></label>
      <label className="field"><span>Short bio</span><textarea rows="4" value={form.bio} onChange={(e) => set("bio", e.target.value)} /></label>
      <div className="member__foot">
        <button className="btn btn--gold btn--sm" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save changes"}</button>
        {status === "saved" && <span className="ok-text">✓ Saved</span>}
        {status && !["saving", "saved"].includes(status) && <span className="form-error">{status}</span>}
      </div>
    </form>
  );
}
