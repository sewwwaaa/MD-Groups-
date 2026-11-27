import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import PropertyImage from "./PropertyImage.jsx";
import { formatPrice } from "../data/properties.js";

export default function PropertyCard({ property: p }) {
  return (
    <article className="pcard">
      <Link to={`/properties/${p.id}`} className="pcard__media">
        <PropertyImage property={p} />
        <span className={`badge ${p.deal === "rent" ? "badge--gold" : ""}`}>
          {p.deal === "rent" ? "For Rent" : "For Sale"}
        </span>
        <span className="pcard__type">{p.type}</span>
      </Link>
      <div className="pcard__body">
        <p className="pcard__price">{formatPrice(p)}</p>
        <h3 className="pcard__title">
          <Link to={`/properties/${p.id}`}>{p.title}</Link>
        </h3>
        <p className="pcard__loc"><Icon name="pin" size={15} /> {p.location}</p>
        <div className="pcard__meta">
          {p.beds && <span><Icon name="bed" size={16} /> {p.beds} Beds</span>}
          {p.baths && <span><Icon name="bath" size={16} /> {p.baths} Baths</span>}
          <span><Icon name="area" size={16} /> {p.size}</span>
        </div>
      </div>
    </article>
  );
}
