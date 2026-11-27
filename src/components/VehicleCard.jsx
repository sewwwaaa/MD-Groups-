import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import PropertyImage from "./PropertyImage.jsx";
import { formatPrice, labelFor, vehicleCategories } from "../data/properties.js";

export default function VehicleCard({ vehicle: v }) {
  return (
    <article className="pcard">
      <Link to={`/vehicles/${v.id}`} className="pcard__media">
        <PropertyImage property={v} />
        <span className={`badge ${v.deal === "rent" ? "badge--gold" : ""}`}>
          {v.deal === "rent" ? "For Hire" : "For Sale"}
        </span>
        {v.year && <span className="pcard__type">{v.year}</span>}
      </Link>
      <div className="pcard__body">
        <p className="pcard__price">{formatPrice(v)}</p>
        <h3 className="pcard__title">
          <Link to={`/vehicles/${v.id}`}>{v.title}</Link>
        </h3>
        <p className="pcard__loc">
          <Icon name="car" size={15} /> {labelFor(vehicleCategories, v.category)}
          {v.location && <> · <Icon name="pin" size={15} /> {v.location}</>}
        </p>
        <div className="pcard__meta">
          {v.mileage && <span><Icon name="gauge" size={16} /> {v.mileage}</span>}
          {v.fuel && <span><Icon name="fuel" size={16} /> {v.fuel}</span>}
          {v.transmission && <span><Icon name="gear" size={16} /> {v.transmission}</span>}
        </div>
      </div>
    </article>
  );
}
