import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Loading from "../components/Loading.jsx";
import PropertyImage from "../components/PropertyImage.jsx";
import { api } from "../api.js";
import { formatPrice, labelFor, propertyTypes, vehicleCategories } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";
import { useAdminData } from "./useAdminData.js";

const config = {
  properties: { title: "Properties", single: "property", types: propertyTypes, typeKey: "type", place: (x) => x.location },
  vehicles: { title: "Vehicles", single: "vehicle", types: vehicleCategories, typeKey: "category", place: (x) => [x.year, x.mileage].filter(Boolean).join(" · ") },
};

export default function ListingsAdmin({ kind, onAuthError }) {
  const c = config[kind];
  const { reload: reloadSite } = useSiteData();
  const { data, setData, error } = useAdminData(`/admin/${kind}`, onAuthError);
  const [q, setQ] = useState("");

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await api(`/admin/${kind}/${item.id}`, { method: "DELETE", auth: true });
      setData(data.filter((x) => x.id !== item.id));
      reloadSite();
    } catch (err) {
      if (err.status === 401) onAuthError();
      else alert(err.message);
    }
  };

  const rows = (data || []).filter((x) => x.title.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <div className="admin__head">
        <div>
          <h1>{c.title}</h1>
          <p className="muted">{data ? `${data.length} ${data.length === 1 ? c.single : kind} in total` : " "}</p>
        </div>
        <Link to={`/admin/${kind}/new`} className="btn btn--gold btn--sm"><Icon name="plus" size={16} /> Add {c.single}</Link>
      </div>

      {error && <p className="form-error">{error}</p>}
      {!data ? <Loading /> : (
        <div className="panel">
          <div className="panel__toolbar">
            <input type="search" placeholder={`Search ${kind}…`} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {rows.length === 0 ? (
            <p className="muted panel__empty">No {kind} found.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th></th><th>Title</th><th>Type</th><th>Price</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.id}>
                      <td className="table__thumb"><PropertyImage property={x} /></td>
                      <td>
                        <Link to={`/admin/${kind}/${x.id}`} className="table__title">{x.title}</Link>
                        <span className="muted small">{c.place(x)}</span>
                      </td>
                      <td>{labelFor(c.types, x[c.typeKey])}</td>
                      <td className="nowrap">{formatPrice(x)}</td>
                      <td>
                        <div className="tags">
                          <span className={`tag ${x.deal === "rent" ? "tag--gold" : ""}`}>
                            {x.deal === "rent" ? (kind === "vehicles" ? "Hire" : "Rent") : "Sale"}
                          </span>
                          {x.featured && <span className="tag tag--green">Featured</span>}
                          {x.hidden && <span className="tag tag--grey">Hidden</span>}
                        </div>
                      </td>
                      <td className="table__actions">
                        <Link to={`/admin/${kind}/${x.id}`} className="icon-btn" title="Edit"><Icon name="edit" size={17} /></Link>
                        {!x.hidden && (
                          <a href={`/${kind}/${x.id}`} target="_blank" rel="noopener noreferrer" className="icon-btn" title="View on website">
                            <Icon name="external" size={17} />
                          </a>
                        )}
                        <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => remove(x)}><Icon name="trash" size={17} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
