// Starting data, used only the first time the server runs (when server/data/db.json doesn't exist yet).
// After that, everything is edited from the admin portal.

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;

export const seed = {
  settings: {
    name: "MD Groups",
    phone: "+94 77 000 0000",
    phone2: "",
    whatsapp: "94770000000",
    email: "info@mdgroups.lk",
    address: "Colombo, Sri Lanka",
    hours: "Mon – Sat, 9:00 AM – 6:00 PM",
    facebook: "",
    instagram: "",
    linkedin: "",
  },

  team: [
    {
      id: "dineth",
      name: "Dineth Sewmina",
      role: "Director · Co-Founder",
      bio: "Dineth works with buyers and sellers to find the right deal, value properties and vehicles fairly and negotiate the best possible price.",
      photo: "/uploads/dineth-sewmina.jpg",
    },
    {
      id: "madusha",
      name: "Madusha Weerakoon",
      role: "Director · Co-Founder",
      bio: "Madusha looks after client relationships, rentals and vehicle sales, and makes sure every step from viewing to signing goes smoothly.",
      photo: "/uploads/madusha-weerakoon.jpg",
    },
  ],

  properties: [
    { id: "modern-house-battaramulla", title: "Modern 3-Bedroom House", location: "Battaramulla, Colombo", city: "Colombo", price: 38500000, deal: "sale", type: "house", beds: 3, baths: 2, size: "1,850 sq ft", land: "8 perches", featured: true, image: img("photo-1600596542815-ffad4c1539a9"), description: "A bright, modern two-storey home in a quiet residential lane, minutes from Battaramulla town. Open-plan living and dining, a modern pantry, a master bedroom with attached bathroom and covered parking for two vehicles.", features: ["Parking for 2 vehicles", "Pipe-borne water", "Hot water", "Modern pantry", "Close to schools", "Clear deeds"] },
    { id: "city-view-apartment-colombo-03", title: "City View Apartment", location: "Colombo 03", city: "Colombo", price: 250000, deal: "rent", type: "apartment", beds: 2, baths: 2, size: "1,100 sq ft", featured: true, image: img("photo-1502672260266-1c1ef2d93688"), description: "Fully furnished apartment on a high floor with city and sea views. Swimming pool, gym, 24-hour security and backup power. Walking distance to Galle Road shops and restaurants.", features: ["Fully furnished", "Swimming pool", "Gym", "24/7 security", "Backup generator", "1 parking slot"] },
    { id: "land-kadawatha", title: "Residential Land Plot", location: "Kadawatha, Gampaha", city: "Gampaha", price: 1200000, priceUnit: "per perch", deal: "sale", type: "land", size: "15 perches", featured: true, image: img("photo-1500382017468-9049fed747ef"), description: "Flat, square residential land close to the Kadawatha expressway entrance. Electricity and water available at the boundary. Ideal for building a family home.", features: ["Close to expressway", "Electricity available", "Water available", "20 ft road access", "Clear deeds"] },
    { id: "family-home-peradeniya", title: "Hill Country Family Home", location: "Peradeniya, Kandy", city: "Kandy", price: 27000000, deal: "sale", type: "house", beds: 4, baths: 3, size: "2,400 sq ft", land: "20 perches", image: img("photo-1564013799919-ab600027ffc6"), description: "A spacious family home with a large garden and cool hill-country climate, close to the University of Peradeniya and Kandy city.", features: ["Large garden", "Mountain views", "Study room", "Parking for 3 vehicles"] },
    { id: "retail-space-dehiwala", title: "Retail Shop Space", location: "Galle Road, Dehiwala", city: "Colombo", price: 180000, deal: "rent", type: "commercial", size: "650 sq ft", image: img("photo-1497366216548-37526070297c"), description: "Ground-floor shop space with a wide frontage directly on Galle Road. Suitable for retail, a showroom, pharmacy or café.", features: ["Main road frontage", "Ground floor", "Three-phase electricity", "Washroom"] },
    { id: "beachside-apartment-unawatuna", title: "Beachside Apartment", location: "Unawatuna, Galle", city: "Galle", price: 45000000, deal: "sale", type: "apartment", beds: 2, baths: 2, size: "1,250 sq ft", featured: true, image: img("photo-1560448204-e02f11c3d0e2"), description: "A stylish apartment a short walk from Unawatuna beach, with a private balcony and shared rooftop pool. Strong holiday-rental income potential.", features: ["Near the beach", "Rooftop pool", "Balcony", "Furnished"] },
  ],

  vehicles: [
    { id: "toyota-aqua-2017", title: "Toyota Aqua G Grade", make: "Toyota", model: "Aqua", year: 2017, category: "car", price: 7350000, deal: "sale", mileage: "68,000 km", fuel: "Hybrid", transmission: "Automatic", location: "Colombo", featured: true, image: img("photo-1549399542-7e3f8b79c341"), description: "Well-maintained Toyota Aqua G Grade with full service records. Excellent fuel economy, ideal for city driving.", features: ["Full service records", "Push start", "Reverse camera", "Alloy wheels", "Original paint"] },
    { id: "honda-vezel-2016", title: "Honda Vezel RS", make: "Honda", model: "Vezel", year: 2016, category: "suv", price: 9800000, deal: "sale", mileage: "74,500 km", fuel: "Hybrid", transmission: "Automatic", location: "Gampaha", featured: true, image: img("photo-1494976388531-d1058494cdd8"), description: "Honda Vezel RS in excellent condition, one owner, accident free. Spacious SUV with great fuel economy.", features: ["One owner", "Accident free", "Paddle shift", "LED headlights", "Leather seats"] },
    { id: "suzuki-wagon-r-2018", title: "Suzuki Wagon R FZ", make: "Suzuki", model: "Wagon R", year: 2018, category: "car", price: 5650000, deal: "sale", mileage: "41,000 km", fuel: "Petrol (Hybrid)", transmission: "Automatic", location: "Kandy", featured: true, image: img("photo-1503376780353-7e6692767b70"), description: "Economical and reliable Suzuki Wagon R FZ, low mileage, perfect first car.", features: ["Low mileage", "Smart key", "Climate control", "Reverse camera"] },
    { id: "toyota-kdh-van-2014", title: "Toyota KDH Van", make: "Toyota", model: "HiAce KDH", year: 2014, category: "van", price: 13500000, deal: "sale", mileage: "152,000 km", fuel: "Diesel", transmission: "Manual", location: "Colombo", image: img("photo-1519641471654-76ce0107ad1b"), description: "Toyota KDH high-roof van, ideal for tourism or staff transport. Well maintained engine.", features: ["High roof", "Dual A/C", "15 seats", "Good tyres"] },
  ],

  enquiries: [],
};
