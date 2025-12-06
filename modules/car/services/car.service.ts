import { prisma } from "@/lib/prisma";
import { mergeDateAndTime } from "../helpers/date.helpers";
import type { Prisma } from "@prisma/client";

export type CarWithPricing = Prisma.CarGetPayload<{
  include: {
    CarImage: true;
    CalendarPrice: true;
    SpecialPrice: true;
    Reservation: true;
    CarCategory: true;
  };
}>;

export class CarService {
  async searchCars(filters: {
    pickupDate: string;
    dropoffDate: string;
    pickupTime: string;
    dropoffTime: string;
    seats?: number;
    categoryId?: number;
  }) {
    const {
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      seats,
      categoryId,
    } = filters;

    // -------------------------------------------------
    // Parse dates
    // -------------------------------------------------
    const start = mergeDateAndTime(pickupDate, pickupTime);
    const end = mergeDateAndTime(dropoffDate, dropoffTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    if (end <= start) {
      throw new Error("Dropoff must be after pickup");
    }

    // -------------------------------------------------
    // Get available cars
    // -------------------------------------------------
    const cars: CarWithPricing[] = await prisma.car.findMany({
      where: {
        available: true,
        status: "AVAILABLE",
        seats: seats ? { gte: seats } : undefined,
        categoryId: categoryId || undefined,
        Reservation: {
          none: {
            status: { not: "cancelled" },
            AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
          },
        },
      },

      include: {
        CarImage: true,
        CalendarPrice: true,
        SpecialPrice: true,
        Reservation: true,
        CarCategory: true,
      },
    });

    // -------------------------------------------------
    // Return mapped cars with pricing
    // -------------------------------------------------
    return cars.map((car) => ({
      car,
      pricing: this.calculateCarPrice(car, start, end),
    }));
  }

  // -------------------------------------------------------------------
  // PRICING LOGIC (Correct day calculation + late dropoff logic)
  // -------------------------------------------------------------------
  private calculateCarPrice(car: CarWithPricing, start: Date, end: Date) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    const startDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    let rentalDays = Math.ceil(
      (endDay.getTime() - startDay.getTime()) / MS_PER_DAY
    );
    if (rentalDays <= 0) rentalDays = 1;

    // -------------------------------------------------
    // LATE DROPOFF EXTRA DAY
    // -------------------------------------------------
    const dropHour = end.getHours();
    const dropMin = end.getMinutes();

    if (dropHour > 12 || (dropHour === 12 && dropMin > 0)) {
      rentalDays += 1;
    }

    // -------------------------------------------------
    // Pricing loop
    // -------------------------------------------------
    let total = 0;
    const breakdown: { date: string; price: number; source: string }[] = [];

    const normalize = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    const cur = new Date(startDay);

    for (let i = 0; i < rentalDays; i++) {
      const dayStr = normalize(cur);

      const calendar = car.CalendarPrice.find((c) => {
        const calStr = normalize(new Date(c.date));
        return calStr === dayStr;
      });

      if (calendar) {
        const price = Number(calendar.price);
        total += price;
        breakdown.push({ date: dayStr, price, source: "calendar" });
      } else {
        const special = car.SpecialPrice.find((s) => {
          const sStart = normalize(new Date(s.startDate));
          const sEnd = normalize(new Date(s.endDate));
          return dayStr >= sStart && dayStr <= sEnd;
        });

        if (special) {
          const price = Number(special.price);
          total += price;
          breakdown.push({ date: dayStr, price, source: "special" });
        } else {
          const base = Number(car.dailyPrice);
          total += base;
          breakdown.push({ date: dayStr, price: base, source: "base" });
        }
      }

      cur.setDate(cur.getDate() + 1);
    }

    return {
      days: rentalDays,
      total,
      discount: 0,
      breakdown,
    };
  }
}

export const carService = new CarService();
