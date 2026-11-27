import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import { propertyTypes, vehicleCategories, uniqueValues } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";

const tabs = [
  ["buy", "Buy Property"],
  ["rent", "Rent Property"],
  ["vehicle", "Vehicles"],
];

export default function SearchBar() {
  const navigate = useNavigate();
  const { properties, vehicles } = useSiteData();
  const [tab, setTab] = useState("buy");
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");

  const isVehicle = tab === "vehicle";
  const typeOptions = isVehicle ? vehicleCategories : propertyTypes;
  const locations = isVehicle ? uniqueValues(vehicles, "location") : uniqueValues(properties, "city");

  const changeTab = (t) => {
    setTab(t);
    setType("all");
    setCity("all");
  };

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (isVehicle) {
      if (type !== "all") params.set("category", type);
      if (city !== "all") params.set("location", city);
      navigate(`/vehicles?${params}`);
    } else {
      params.set("deal", tab === "rent" ? "rent" : "sale");
      if (type !== "all") params.set("type", type);
      if (city !== "all") params.set("city", city);
      navigate(`/properties?${params}`);
    }
  };

  return (
    <form className="searchbar" onSubmit={submit}>
      <div className="searchbar__tabs" role="tablist">
        {tabs.map(([v, label]) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={tab === v}
            className={tab === v ? "is-active" : ""}
            onClick={() => changeTab(v)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="searchbar__fields">
        <label>
          <span>{isVehicle ? "Vehicle type" : "Property type"}</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Location</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="all">All locations</option>
            {locations.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <button type="submit" className="btn btn--gold">
          <Icon name="search" size={18} /> Search
        </button>
      </div>
    </form>
  );
}
