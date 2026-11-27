import { useState } from "react";
import Icon from "../components/Icon.jsx";
import Loading from "../components/Loading.jsx";
import { api } from "../api.js";
import { useAdminData, formatDate } from "./useAdminData.js";

export default function Enquiries({ onAuthError }) {
  const { data, setData, error } = useAdminData("/admin/enquiries", onAuthError);
  const [filter, setFilter] = useState("all");

  const act = async (fn) => {
    try { await fn(); } catch (err) { if (err.status === 401) onAuthError(); else alert(err.message); }
  };

  const toggleRead = (e) => act(async () => {
    const updated = await api(`/admin/enquiries/${e.id}`, { method: "PATCH", body: { read: !e.read }, auth: true });
    setData(data.map((x) => (x.id === e.id ? updated : x)));
  });

  const remove = (e) => {
    if (!window.confirm(`Delete the enquiry from ${e.name}?`)) return;
    act(async () => {
      await api(`/admin/enquiries/${e.id}`, { method: "DELETE", auth: true });
      setData(data.filter((x) => x.id !== e.id));
    });
  };

  const rows = (data || []).filter((e) => filter === "all" || (filter === "unread" ? !e.read : e.read));

  return (
    <>
      <div className="admin__head">
        <div>
          <h1>Enquiries</h1>
          <p className="muted">Messages sent from the website's contact form.</p>
        </div>
        <div className="segmented">
          {[["all", "All"], ["unread", "Unread"], ["read", "Read"]].map(([v, l]) => (
            <button key={v} className={filter === v ? "is-active" : ""} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {!data ? <Loading /> : rows.length === 0 ? (
        <div className="panel"><p className="muted panel__empty">No enquiries here.</p></div>
      ) : (
        <div className="enquiries">
          {rows.map((e) => {
            const wa = e.phone.replace(/\D/g, "").replace(/^0/, "94");
            return (
              <article key={e.id} className={`enquiry ${e.read ? "" : "is-unread"}`}>
                <header>
                  <div>
                    <h3>{e.name} {!e.read && <span className="tag tag--gold">New</span>}</h3>
                    <span className="muted small">{formatDate(e.createdAt)} · {e.interest}</span>
                  </div>
                  <div className="table__actions">
                    <button className="icon-btn" title={e.read ? "Mark as unread" : "Mark as read"} onClick={() => toggleRead(e)}>
                      <Icon name={e.read ? "eyeoff" : "check"} size={17} />
                    </button>
                    <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => remove(e)}>
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                </header>
                {e.message && <p className="enquiry__msg">{e.message}</p>}
                <div className="enquiry__contact">
                  <a href={`tel:${e.phone}`}><Icon name="phone" size={15} /> {e.phone}</a>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={15} /> WhatsApp</a>
                  {e.email && <a href={`mailto:${e.email}`}><Icon name="mail" size={15} /> {e.email}</a>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
