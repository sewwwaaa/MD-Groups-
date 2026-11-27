// Options and helpers for property & vehicle listings.
// The listings themselves are managed in the admin portal (/admin).

export const propertyTypes = [
  { value: "all", label: "All types" },
  { value: "house", label: "Houses" },
  { value: "apartment", label: "Apartments" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

export const vehicleCategories = [
  { value: "all", label: "All vehicles" },
  { value: "car", label: "Cars" },
  { value: "suv", label: "SUVs & Jeeps" },
  { value: "van", label: "Vans" },
  { value: "motorbike", label: "Motorbikes" },
  { value: "three-wheeler", label: "Three-wheelers" },
  { value: "lorry", label: "Lorries & Commercial" },
];

export const labelFor = (list, value) => list.find((x) => x.value === value)?.label.replace(/s$/, "") || value;

export const uniqueValues = (items, key) =>
  [...new Set(items.map((x) => x[key]).filter(Boolean))].sort();

export function formatPrice(p) {
  const amount = "LKR " + Number(p.price || 0).toLocaleString("en-LK");
  if (p.priceUnit) return `${amount} ${p.priceUnit}`;
  if (p.deal === "rent") return `${amount} / month`;
  return amount;
}
