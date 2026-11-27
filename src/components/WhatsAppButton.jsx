import Icon from "./Icon.jsx";
import { useSiteData } from "../context/SiteData.jsx";

export default function WhatsAppButton() {
  const { settings } = useSiteData();
  if (!settings.whatsapp) return null;
  return (
    <a
      className="wa-float"
      href={`https://wa.me/${settings.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <Icon name="whatsapp" size={28} />
    </a>
  );
}
