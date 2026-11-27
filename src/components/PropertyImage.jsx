import { useState } from "react";

const fallback = {
  house: "linear-gradient(135deg, #1d4a72, #3c78a8)",
  apartment: "linear-gradient(135deg, #2b3d55, #5a7391)",
  land: "linear-gradient(135deg, #3d6b45, #7fa36b)",
  commercial: "linear-gradient(135deg, #7a5a1e, #c9a24a)",
  vehicle: "linear-gradient(135deg, #2a2f38, #56606e)",
};

// Shows the listing photo, or a coloured placeholder if the photo can't load.
export default function PropertyImage({ property, className = "" }) {
  const [failed, setFailed] = useState(false);
  const bg = fallback[property.type] || fallback.vehicle;
  if (failed || !property.image) {
    return <div className={`pimg pimg--fallback ${className}`} style={{ background: bg }} />;
  }
  return (
    <img
      className={`pimg ${className}`}
      src={property.image}
      alt={property.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
