import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import Loading from "../components/Loading.jsx";
import { vehicleCategories, uniqueValues } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";

const sorters = {
  newest: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "year-desc": (a, b) => (b.year || 0) - (a.year || 0),
};

export default function Vehicles() {
  const { vehicles, loading } = useSiteData();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const make = params.get("make") || "all";
  const location = params.get("location") || "all";
  const sort = params.get("sort") || "newest";
  const q = params.get("q") || "";
  const makes = uniqueValues(vehicles, "make");
  const locations = uniqueValues(vehicles, "location");

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "newest")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return vehicles
      .filter((v) =>
        (category === "all" || v.category === category) &&
        (make === "all" || v.make === make) &&
        (location === "all" || v.location === location) &&
        (!term || `${v.title} ${v.make} ${v.model}`.toLowerCase().includes(term))
      )
      .sort(sorters[sort] || sorters.newest);
  }, [vehicles, category, make, location, sort, q]);

  return (
    <>
      <PageHero
        title="Vehicles"
        subtitle="Cars, SUVs, vans and more, inspected and fairly priced. Want to sell your vehicle? We can help with that too."
      />

      <section className="section section--tight">
        <div className="container">
          <div className="filterbar filterbar--vehicles">
            <input type="search" placeholder="Search make or model…" value={q}
              onChange={(e) => update("q", e.target.value)} aria-label="Search vehicles" />
            <select value={category} onChange={(e) => update("category", e.target.value)} aria-label="Vehicle type">
              {vehicleCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={make} onChange={(e) => update("make", e.target.value)} aria-label="Make">
              <option value="all">All makes</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={location} onChange={(e) => update("location", e.target.value)} aria-label="Location">
              <option value="all">All locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={sort} onChange={(e) => update("sort", e.target.value)} aria-label="Sort">
              <option value="newest">Sort: Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest first</option>
            </select>
          </div>

          {loading ? <Loading /> : (
            <>
              <p className="results-count">
                Showing <strong>{results.length}</strong> {results.length === 1 ? "vehicle" : "vehicles"}
              </p>
              {results.length > 0 ? (
                <div className="grid grid--3">
                  {results.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
                </div>
              ) : (
                <div className="empty">
                  <h3>No vehicles match your search yet</h3>
                  <p>Tell us the make, model and budget you want and we will source it for you.</p>
                  <div className="empty__actions">
                    <button className="btn btn--outline" onClick={() => setParams({})}>Clear filters</button>
                    <Link to="/contact" className="btn btn--gold">Find me a vehicle</Link>
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
