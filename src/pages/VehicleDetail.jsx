import { useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import ListingDetail from "../components/ListingDetail.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import Loading from "../components/Loading.jsx";
import NotFound from "./NotFound.jsx";
import { labelFor, vehicleCategories } from "../data/properties.js";
import { useSiteData } from "../context/SiteData.jsx";

export default function VehicleDetail() {
  const { id } = useParams();
  const { vehicles, loading } = useSiteData();
  if (loading) return <div className="detail-top"><Loading /></div>;

  const v = vehicles.find((x) => x.id === id);
  if (!v) return <NotFound />;

  return (
    <ListingDetail
      item={v}
      badge={v.deal === "rent" ? "For Hire" : "For Sale"}
      subtitle={<><Icon name="pin" size={18} /> {v.location || "Sri Lanka"}</>}
      backTo="/vehicles"
      backLabel="Back to vehicles"
      facts={[
        { icon: "car", label: "Make / Model", value: [v.make, v.model].filter(Boolean).join(" ") },
        { icon: "calendar", label: "Year", value: v.year },
        { icon: "tag", label: "Type", value: labelFor(vehicleCategories, v.category) },
        { icon: "gauge", label: "Mileage", value: v.mileage },
        { icon: "fuel", label: "Fuel", value: v.fuel },
        { icon: "gear", label: "Transmission", value: v.transmission },
      ]}
      similar={vehicles.filter((x) => x.id !== v.id && x.category === v.category).slice(0, 3)}
      similarTitle="Similar vehicles"
      renderCard={(x) => <VehicleCard key={x.id} vehicle={x} />}
    />
  );
}
