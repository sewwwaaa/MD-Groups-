import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Loading from "../components/Loading.jsx";
import { useAdminData, formatDate } from "./useAdminData.js";

export default function Dashboard({ onAuthError }) {
  const { data, error } = useAdminData("/admin/summary", onAuthError);

  if (error) return <p className="form-error">{error}</p>;
  if (!data) return <Loading />;

  const stats = [
    { label: "Properties", value: data.properties, icon: "home", to: "/admin/properties" },
    { label: "Vehicles", value: data.vehicles, icon: "car", to: "/admin/vehicles" },
    { label: "Enquiries", value: data.enquiries, icon: "inbox", to: "/admin/enquiries" },
    { label: "Unread enquiries", value: data.unread, icon: "mail", to: "/admin/enquiries", highlight: data.unread > 0 },
  ];

  return (
    <>
      <div className="admin__head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back. Here's what's happening on your website.</p>
        </div>
        <div className="admin__actions">
          <Link to="/admin/properties/new" className="btn btn--gold btn--sm"><Icon name="plus" size={16} /> Add property</Link>
          <Link to="/admin/vehicles/new" className="btn btn--navy-sm btn--sm"><Icon name="plus" size={16} /> Add vehicle</Link>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className={`stat ${s.highlight ? "stat--hl" : ""}`}>
            <Icon name={s.icon} size={24} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2>Latest enquiries</h2>
          <Link to="/admin/enquiries" className="link-arrow link-arrow--sm">View all <Icon name="arrow" size={16} /></Link>
        </div>
        {data.latest.length === 0 ? (
          <p className="muted panel__empty">No enquiries yet. Messages sent from the website's contact form will appear here.</p>
        ) : (
          <ul className="mini-list">
            {data.latest.map((e) => (
              <li key={e.id} className={e.read ? "" : "is-unread"}>
                <div>
                  <strong>{e.name}</strong> · {e.interest}
                  <p className="muted">{e.message ? e.message.slice(0, 110) + (e.message.length > 110 ? "…" : "") : "No message"}</p>
                </div>
                <span className="muted small">{formatDate(e.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
