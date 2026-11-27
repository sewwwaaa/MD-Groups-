import { useParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import ListingDetail from "../components/ListingDetail.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import Loading from "../components/Loading.jsx";
import NotFound from "./NotFound.jsx";
import { useSiteData } from "../context/SiteData.jsx";

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, loading } = useSiteData();
  if (loading) return <div className="detail-top"><Loading /></div>;

  const p = properties.find((x) => x.id === id);
  if (!p) return <NotFound />;

  return (
    <ListingDetail
      item={p}
      badge={p.deal === "rent" ? "For Rent" : "For Sale"}
      subtitle={<><Icon name="pin" size={18} /> {p.location}</>}
      backTo="/properties"
      backLabel="Back to properties"
      facts={[
        { icon: "tag", label: "Status", value: p.deal === "rent" ? "For Rent" : "For Sale" },
        { icon: "home", label: "Type", value: p.type && p.type[0].toUpperCase() + p.type.slice(1) },
        { icon: "bed", label: "Bedrooms", value: p.beds },
        { icon: "bath", label: "Bathrooms", value: p.baths },
        { icon: "area", label: p.type === "land" ? "Land size" : "Floor area", value: p.size },
        { icon: "pin", label: "Land size", value: p.type === "land" ? null : p.land },
      ]}
      similar={properties.filter((x) => x.id !== p.id && x.type === p.type).slice(0, 3)}
      similarTitle="Similar properties"
      renderCard={(x) => <PropertyCard key={x.id} property={x} />}
    />
  );
}
