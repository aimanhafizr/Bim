export interface Hall {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  image: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  features: string[];
}

export interface Booking {
  id: string;
  hallId: string;
  hallName: string;
  date: string; // YYYY-MM-DD
  timeSlots: string[]; // e.g. ["09:00 AM", "10:00 AM"]
  totalPaid: number;
  paymentStatus: "pending" | "success" | "failed";
  name: string;
  email: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string; // e.g. "09:00 AM"
  isAvailable: boolean;
}
