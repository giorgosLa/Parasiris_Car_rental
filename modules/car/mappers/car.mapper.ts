// modules/car/mappers/car.mapper.ts

import type { CarWithPricing } from "../services/car.service";

type Pricing = {
  days: number;
  total: number;
  discount: number;
  breakdown: Array<{ date: string; price: number; source: string }>;
};

export function mapCarToSearchResult(
  car: CarWithPricing,
  pricing: Pricing
) {
  // Προστασία αν για κάποιο λόγο δεν έρθει pricing
  const total = Number(pricing?.total ?? 0);
  const days = Number(pricing?.days ?? 1);

  const pricePerDay =
    days > 0 ? Number((total / days).toFixed(2)) : Number(car.dailyPrice ?? 0);

  return {
    id: car.id,
    make: car.make,
    model: car.model,
    seats: car.seats,
    transmission: car.transmission,
    fuelType: car.fuelType,
    category: car.CarCategory?.name || null,

    // Προτιμά το imageUrl (Cloudinary), μετά fallback
    image:
      car.imageUrl?.trim() ||
      "/images/no-car.png",

    // Τιμές από pricing
    totalPrice: total,
    days,
    discount: pricing?.discount ?? 0,
    pricePerDay,
    breakdown: pricing?.breakdown ?? [],
  };
}
