export const hotelInfo: Record<
  string,
  {
    stars: number;
    area: string;
    distance: number;
    reviews: number;
    kind: string;
    amenities: string[];
    breakfast: boolean;
    refundable: boolean;
    address: string;
  }
> = {
  "casa-bonay": {
    stars: 4,
    area: "Eixample",
    distance: 1.1,
    reviews: 1248,
    kind: "Boutique hotel",
    amenities: [
      "Free Wi-Fi",
      "Restaurant",
      "Air conditioning",
      "Terrace",
      "Pet friendly",
      "Accessible rooms",
    ],
    breakfast: false,
    refundable: true,
    address: "Gran Via de les Corts Catalanes, 700",
  },
  "the-hoxton": {
    stars: 4,
    area: "Poblenou",
    distance: 2.7,
    reviews: 986,
    kind: "Design hotel",
    amenities: [
      "Free Wi-Fi",
      "Restaurant",
      "Air conditioning",
      "Pool",
      "Terrace",
      "Accessible rooms",
    ],
    breakfast: false,
    refundable: false,
    address: "Avinguda Diagonal, 205",
  },
  "casa-mediterranea": {
    stars: 3,
    area: "Barceloneta",
    distance: 1.8,
    reviews: 624,
    kind: "Guesthouse",
    amenities: ["Free Wi-Fi", "Air conditioning", "Terrace", "Parking"],
    breakfast: true,
    refundable: false,
    address: "Barceloneta neighborhood",
  },
};
export const samplePhotos = [
  {
    src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop",
    label: "Guest room",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop",
    label: "Outdoor spaces",
  },
  {
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop",
    label: "A place to unwind",
  },
];
export const roomNames = [
  "Cozy Double Room",
  "Roomy Double Room",
  "Terrace Suite",
];
export function nightsBetween(start: string, end: string) {
  return Math.max(
    1,
    Math.round((Date.parse(end) - Date.parse(start)) / 86400000) || 4,
  );
}
