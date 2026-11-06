export const destinations = [
  {
    name: "Barcelona",
    country: "Spain",
    tag: "City meets sea",
    price: 98,
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&auto=format&fit=crop",
  },
  {
    name: "Bali",
    country: "Indonesia",
    tag: "A little more paradise",
    price: 64,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop",
  },
  {
    name: "Lisbon",
    country: "Portugal",
    tag: "Follow the sunshine",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&auto=format&fit=crop",
  },
  {
    name: "Santorini",
    country: "Greece",
    tag: "Blue looks good on you",
    price: 112,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&auto=format&fit=crop",
  },
  {
    name: "Kyoto",
    country: "Japan",
    tag: "Take the scenic route",
    price: 91,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop",
  },
];
export type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  rating: string;
  image: string;
  description: string;
  feature: string;
};
export const products: Product[] = [
  {
    id: "casa-bonay",
    name: "Casa Bonay",
    type: "hotels",
    price: 148,
    rating: "9.4",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000&auto=format&fit=crop",
    description:
      "An independent boutique hideaway with thoughtful design, a leafy rooftop and a very local soul.",
    feature: "Free cancellation",
  },
  {
    id: "the-hoxton",
    name: "The Hoxton, Poblenou",
    type: "hotels",
    price: 189,
    rating: "9.2",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop",
    description:
      "Sun-drenched rooms, a rooftop pool and the neighborhood at your doorstep.",
    feature: "Rooftop pool",
  },
  {
    id: "casa-mediterranea",
    name: "Casa Mediterranea",
    type: "hotels",
    price: 98,
    rating: "9.1",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop",
    description:
      "Slow mornings and sea views. A relaxed Mediterranean stay made for switching off.",
    feature: "Breakfast included",
  },
  {
    id: "vueling-barcelona",
    name: "Vueling · London to Barcelona",
    type: "flights",
    price: 79,
    rating: "8.7",
    image: destinations[0].image,
    description: "LGW 09:40 → BCN 12:50 · 2h 10m · Nonstop",
    feature: "Cabin bag included",
  },
  {
    id: "iberia-barcelona",
    name: "Iberia · London to Barcelona",
    type: "flights",
    price: 112,
    rating: "9.1",
    image: destinations[0].image,
    description: "LHR 12:15 → BCN 15:20 · 2h 05m · Nonstop",
    feature: "Flexible fares available",
  },
  {
    id: "barcelona-escape",
    name: "Barcelona, beautifully bundled",
    type: "packages",
    price: 499,
    rating: "9.3",
    image: destinations[0].image,
    description:
      "4 nights at Casa Bonay + return economy flights from London. Price per person, based on 2 sharing.",
    feature: "Save with a package",
  },
  {
    id: "santorini-escape",
    name: "A little Santorini sunshine",
    type: "packages",
    price: 679,
    rating: "9.5",
    image: destinations[3].image,
    description:
      "4 nights by the Aegean + return flights from London. Price per person, based on 2 sharing.",
    feature: "Breakfast included",
  },
  {
    id: "fiat-500",
    name: "Fiat 500 or similar",
    type: "cars",
    price: 34,
    rating: "9.0",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop",
    description: "Mini · 4 seats · 1 bag · Manual · Petrol · Airport pickup",
    feature: "Unlimited mileage",
  },
  {
    id: "coastal-drive",
    name: "Volkswagen Golf or similar",
    type: "cars",
    price: 48,
    rating: "9.2",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&auto=format&fit=crop",
    description: "Compact · 5 seats · 2 bags · Automatic · Airport pickup",
    feature: "Basic insurance included",
  },
  {
    id: "tapas-walk",
    name: "A taste of Barcelona",
    type: "activities",
    price: 49,
    rating: "9.6",
    image:
      "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=900&auto=format&fit=crop",
    description:
      "A 3-hour small-group tapas walk through the Gothic Quarter with a local food lover.",
    feature: "Food & drinks included",
  },
  {
    id: "sailing-sunset",
    name: "Chase the Mediterranean sunset",
    type: "activities",
    price: 65,
    rating: "9.8",
    image: "/images/coast.png",
    description:
      "A relaxed 2-hour sailing experience with sea breezes, local wine and golden-hour views.",
    feature: "Small group experience",
  },
  {
    id: "airport-transfer",
    name: "Your easy airport arrival",
    type: "transfers",
    price: 42,
    rating: "9.2",
    image: destinations[0].image,
    description:
      "Private airport transfer · Up to 3 passengers · 2 suitcases · Meet and greet",
    feature: "Flight monitoring included",
  },
];
export const categories = [
  { name: "Stays", path: "hotels" },
  { name: "Flights", path: "flights" },
  { name: "Flight + Hotel", path: "packages" },
  { name: "Cars", path: "cars" },
  { name: "Transfers", path: "transfers" },
  { name: "Things to do", path: "activities" },
];
export function detailUrl(p: Product) {
  return `/${p.type === "hotels" ? "hotel" : p.type === "activities" ? "activity" : p.type}/${p.id}`;
}
export function money(n: number, currency = "EUR") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n * (currency === "USD" ? 1.09 : currency === "GBP" ? 0.86 : 1));
}
