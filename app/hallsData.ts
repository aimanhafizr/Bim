import { Hall, Booking } from "./types";

export const halls: Hall[] = [
  {
    id: "grand-ballroom",
    name: "The Grand Ballroom",
    description: "Experience royal luxury in our main event room. Features majestic gold trim, crystal chandeliers, a grand stage, and a vast marble dance floor. Perfect for lavish weddings, galas, and high-profile ceremonies.",
    capacity: 500,
    pricePerHour: 250,
    image: "/images/grand_ballroom.png",
    rating: 4.9,
    reviewsCount: 124,
    amenities: [
      "State-of-the-Art Sound System",
      "Full Stage Setup",
      "Dynamic Crystal Chandeliers",
      "Bridal & VIP Suites",
      "Gourmet Catering Kitchen Access",
      "High-speed Wi-Fi"
    ],
    features: [
      "500-guest maximum",
      "Valet parking available",
      "Premium bar setup",
      "Custom dynamic lighting"
    ]
  },
  {
    id: "metropolitan-hall",
    name: "Metropolitan Conference Hall",
    description: "A premium corporate venue built for high-impact events. Features modern minimalist wood design, ergonomic seating, a massive high-tech projector screen, and floor-to-ceiling glass windows offering gorgeous urban views.",
    capacity: 150,
    pricePerHour: 120,
    image: "/images/metropolitan_hall.png",
    rating: 4.8,
    reviewsCount: 88,
    amenities: [
      "8K UHD Interactive Projector Screen",
      "Dedicated High-Speed Fiber Internet",
      "Executive Soundproofing",
      "Presenter Podiums & Lavaliere Mics",
      "Continuous Coffee Bar",
      "Smart HVAC Climate Control"
    ],
    features: [
      "150-guest maximum",
      "Business center access",
      "Hybrid video-conferencing setup",
      "Wheelchair accessible"
    ]
  },
  {
    id: "glasshouse-garden",
    name: "The Glasshouse Garden",
    description: "A breathtaking botanical greenhouse venue surrounded by lush flora and soft hanging florals. A pristine glass roof lets in natural sunlight by day and starry views by night, creating an enchanting natural setting.",
    capacity: 200,
    pricePerHour: 180,
    image: "/images/glasshouse_garden.png",
    rating: 4.9,
    reviewsCount: 95,
    amenities: [
      "Ambient Hanging Fairy Lights",
      "Indoor Waterfall Backdrops",
      "Acoustic-optimized Glass Panels",
      "Rustic Oak Tables & Crossback Chairs",
      "Outdoor Patio Extension",
      "Eco-friendly Cooling Systems"
    ],
    features: [
      "200-guest maximum",
      "Beautiful photo opportunities",
      "Natural daylight design",
      "Integrated bug-repelling system"
    ]
  },
  {
    id: "acoustic-lounge",
    name: "The Acoustic Lounge",
    description: "A cozy, vintage-styled hall clad in solid dark timber. Designed with top-tier acoustic resonance, cozy leather Chesterfield sofas, glowing retro lamps, and an elegant Steinway grand piano on a velvet-curtained stage.",
    capacity: 80,
    pricePerHour: 90,
    image: "/images/acoustic_lounge.png",
    rating: 4.7,
    reviewsCount: 64,
    amenities: [
      "Steinway Grand Piano",
      "Vintage Sound Recording Equipment",
      "Plush Leather Lounge Seating",
      "Intimate Warm Dimming Spotlights",
      "Craft Beverage Station",
      "DJ & Live Performance Deck"
    ],
    features: [
      "80-guest maximum",
      "Exceptional acoustics",
      "Intimate dark-mode atmosphere",
      "Private back-stage entrance"
    ]
  }
];

// Helper to get formatted dates relative to today
const getRelativeDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
};

export const initialBookings: Booking[] = [
  {
    id: "bk-1001",
    hallId: "grand-ballroom",
    hallName: "The Grand Ballroom",
    date: getRelativeDateString(0), // Today
    timeSlots: ["10:00 AM", "11:00 AM", "12:00 PM"],
    totalPaid: 750,
    paymentStatus: "success",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "bk-1002",
    hallId: "metropolitan-hall",
    hallName: "Metropolitan Conference Hall",
    date: getRelativeDateString(1), // Tomorrow
    timeSlots: ["02:00 PM", "03:00 PM", "04:00 PM"],
    totalPaid: 360,
    paymentStatus: "success",
    name: "Alex Rivera (Tech Corp)",
    email: "alex@techcorp.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "bk-1003",
    hallId: "glasshouse-garden",
    hallName: "The Glasshouse Garden",
    date: getRelativeDateString(0), // Today
    timeSlots: ["06:00 PM", "07:00 PM", "08:00 PM"],
    totalPaid: 540,
    paymentStatus: "success",
    name: "Evelyn & Thomas Wedding",
    email: "evelyn.t@weddingmail.com",
    createdAt: new Date().toISOString()
  },
  {
    id: "bk-1004",
    hallId: "acoustic-lounge",
    hallName: "The Acoustic Lounge",
    date: getRelativeDateString(2), // Day after tomorrow
    timeSlots: ["08:00 PM", "09:00 PM"],
    totalPaid: 180,
    paymentStatus: "success",
    name: "Jazz Quartet Live",
    email: "jazz.club@musicmail.net",
    createdAt: new Date().toISOString()
  }
];

export const ALL_TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM"
];
