import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Loading from "../components/Loading.jsx";
import { propertyTypes, uniqueValues } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";

const sorters = {
  newest: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

export default function Properties() {
  const { properties, loading } = useSiteData();
  const [params, setParams] = useSearchParams();
  const deal = params.get("deal") || "all";
  const type = params.get("type") || "all";
  const city = params.get("city") || "all";
  const sort = params.get("sort") || "newest";
  const q = params.get("q") || "";
  const cities = uniqueValues(properties, "city");

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "newest")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return properties
      .filter((p) =>
        (deal === "all" || p.deal === deal) &&
        (type === "all" || p.type === type) &&
        (city === "all" || p.city === city) &&
        (!term || `${p.title} ${p.location}`.toLowerCase().includes(term))
      )
      .sort(sorters[sort] || sorters.newest);
  }, [properties, deal, type, city, sort, q]);

  return (
    <>
      <PageHero
        title="Properties"
        subtitle="Houses, apartments, land and commercial spaces for sale and rent across Sri Lanka."
      />

      <section className="section section--tight">
        <div className="container">
          <div className="filterbar">
            <div className="segmented" role="group" aria-label="Buy or rent">
              {[["all", "All"], ["sale", "For Sale"], ["rent", "For Rent"]].map(([v, label]) => (
                <button key={v} className={deal === v ? "is-active" : ""} onClick={() => update("deal", v)}>
                  {label}
                </button>
              ))}
            </div>
            <input type="search" placeholder="Search by name or area…" value={q}
              onChange={(e) => update("q", e.target.value)} aria-label="Search properties" />
            <select value={type} onChange={(e) => update("type", e.target.value)} aria-label="Property type">
              {propertyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={city} onChange={(e) => update("city", e.target.value)} aria-label="Location">
              <option value="all">All locations</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort">
              <option value="newest">Sort: Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? <Loading /> : (
            <>
              <p className="results-count">
                Showing <strong>{results.length}</strong> {results.length === 1 ? "property" : "properties"}
              </p>
              {results.length > 0 ? (
                <div className="grid grid--3">
                  {results.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>
              ) : (
                <div className="empty">
                  <h3>No properties match your search yet</h3>
                  <p>New properties come in every week. Tell us what you are looking for and we will find it for you.</p>
                  <div className="empty__actions">
                    <button className="btn btn--outline" onClick={() => setParams({})}>Clear filters</button>
                    <Link to="/contact" className="btn btn--gold">Tell us what you need</Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
