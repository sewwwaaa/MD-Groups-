import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Loading from "../components/Loading.jsx";
import { api } from "../api.js";
import { propertyTypes, vehicleCategories } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";
import ImageUpload from "./ImageUpload.jsx";

// Form fields for each kind of listing.
const FIELDS = {
  properties: [
    { key: "title", label: "Title *", wide: true, placeholder: "e.g. Modern 3-Bedroom House" },
    { key: "deal", label: "Listing for", type: "select", options: [["sale", "Sale"], ["rent", "Rent"]] },
    { key: "type", label: "Property type", type: "select", options: propertyTypes.filter((t) => t.value !== "all").map((t) => [t.value, t.label.replace(/s$/, "")]) },
    { key: "price", label: "Price (LKR) *", type: "number", placeholder: "e.g. 38500000" },
    { key: "priceUnit", label: "Price note", placeholder: "Optional, e.g. per perch" },
    { key: "location", label: "Address / area", placeholder: "e.g. Battaramulla, Colombo" },
    { key: "city", label: "District / city (for search)", placeholder: "e.g. Colombo" },
    { key: "beds", label: "Bedrooms", type: "number" },
    { key: "baths", label: "Bathrooms", type: "number" },
    { key: "size", label: "Floor area / land size", placeholder: "e.g. 1,850 sq ft or 15 perches" },
    { key: "land", label: "Land size (houses)", placeholder: "e.g. 8 perches" },
  ],
  vehicles: [
    { key: "title", label: "Title *", wide: true, placeholder: "e.g. Toyota Aqua G Grade" },
    { key: "make", label: "Make", placeholder: "e.g. Toyota" },
    { key: "model", label: "Model", placeholder: "e.g. Aqua" },
    { key: "year", label: "Year", type: "number", placeholder: "e.g. 2017" },
    { key: "category", label: "Vehicle type", type: "select", options: vehicleCategories.filter((t) => t.value !== "all").map((t) => [t.value, t.label.replace(/s$/, "")]) },
    { key: "deal", label: "Listing for", type: "select", options: [["sale", "Sale"], ["rent", "Hire / Rent"]] },
    { key: "price", label: "Price (LKR) *", type: "number", placeholder: "e.g. 7350000" },
    { key: "mileage", label: "Mileage", placeholder: "e.g. 68,000 km" },
    { key: "fuel", label: "Fuel", type: "select", options: ["Petrol", "Diesel", "Hybrid", "Petrol (Hybrid)", "Electric"].map((x) => [x, x]) },
    { key: "transmission", label: "Transmission", type: "select", options: [["Automatic", "Automatic"], ["Manual", "Manual"], ["Tiptronic", "Tiptronic"]] },
    { key: "location", label: "Location", placeholder: "e.g. Colombo" },
  ],
};

const DEFAULTS = {
  properties: { deal: "sale", type: "house" },
  vehicles: { deal: "sale", category: "car", fuel: "Petrol", transmission: "Automatic" },
};

export default function ListingEditor({ kind, onAuthError }) {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { reload: reloadSite } = useSiteData();
  const single = kind === "properties" ? "property" : "vehicle";

  const [form, setForm] = useState(isNew ? { ...DEFAULTS[kind], features: "" } : null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api(`/admin/${kind}`, { auth: true })
      .then((list) => {
        const item = list.find((x) => x.id === id);
        if (!item) return setError(`This ${single} was not found.`);
        setForm({ ...item, features: (item.features || []).join("\n") });
      })
      .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)));
  }, [kind, id, isNew, single, onAuthError]);

  if (!form) return error ? <p className="form-error">{error}</p> : <Loading />;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.title?.trim() || form.price === undefined || form.price === "") {
      setError("Please fill in the title and price.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api(isNew ? `/admin/${kind}` : `/admin/${kind}/${id}`, {
        method: isNew ? "POST" : "PUT",
        body: form,
        auth: true,
      });
      reloadSite();
      navigate(`/admin/${kind}`);
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save}>
      <div className="admin__head">
        <div>
          <Link to={`/admin/${kind}`} className="back-link"><Icon name="back" size={16} /> All {kind}</Link>
          <h1>{isNew ? `Add ${single}` : `Edit ${single}`}</h1>
        </div>
        <div className="admin__actions">
          <Link to={`/admin/${kind}`} className="btn btn--outline btn--sm">Cancel</Link>
          <button className="btn btn--gold btn--sm" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>

      {error && <p className="form-error panel-error">{error}</p>}

      <div className="editor">
        <div className="panel">
          <h2 className="panel__title">Details</h2>
          <div className="form-grid">
            {FIELDS[kind].map((f) => (
              <label key={f.key} className={`field ${f.wide ? "field--wide" : ""}`}>
                <span>{f.label}</span>
                {f.type === "select" ? (
                  <select value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                    {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.key] ?? ""}
                    placeholder={f.placeholder}
                    min={f.type === "number" ? 0 : undefined}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                )}
              </label>
            ))}
            <label className="field field--wide">
              <span>Description</span>
              <textarea rows="5" value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </label>
            <label className="field field--wide">
              <span>Features (one per line)</span>
              <textarea rows="5" value={form.features} onChange={(e) => set("features", e.target.value)}
                placeholder={"Parking for 2 vehicles\nClear deeds"} />
            </label>
          </div>
        </div>

        <div className="editor__side">
          <div className="panel">
            <ImageUpload label="Main photo" value={form.image} onChange={(url) => set("image", url)} onAuthError={onAuthError} />
          </div>
          <div className="panel">
            <h2 className="panel__title">Visibility</h2>
            <label className="switch">
              <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => set("featured", e.target.checked)} />
              <span>Featured on home page</span>
            </label>
            <label className="switch">
              <input type="checkbox" checked={Boolean(form.hidden)} onChange={(e) => set("hidden", e.target.checked)} />
              <span>Hide from website (e.g. sold)</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
