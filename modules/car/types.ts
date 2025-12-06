type CarBreakdownItem = {
  date: string;
  price: number;
  source: "base" | "calendar" | "special" | "late-dropoff";
};

type CarSearchResult = {
  id: number;
  make: string;
  model: string;
  seats: number;
  transmission: string;
  fuelType: string;
  category: string | null;
  image: string;
  totalPrice: number;
  days: number;
  discount: number;
  pricePerDay: number;
  breakdown: CarBreakdownItem[];
};
export type { CarSearchResult, CarBreakdownItem };
