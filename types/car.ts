export interface CarResult {
  id: number;
  make: string;
  model: string;
  seats: number;
  doors?: number;
  fuelType: string;
  transmission: string;
  category?: string;
  image?: string;
  pricePerDay: number;
  totalPrice: number;
  days: number;
  breakdown?: { date: string; price: number }[];
}
