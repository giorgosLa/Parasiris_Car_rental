import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pickupDate, dropoffDate, pickupTime, dropoffTime } = body;

    if (!pickupDate || !dropoffDate)
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });

    // Build actual datetime range
    const start = new Date(`${pickupDate}T${pickupTime || "00:00"}`);
    const end = new Date(`${dropoffDate}T${dropoffTime || "23:59"}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    // Build YYYY-MM-DD list for each rental day
    const dayList: string[] = [];
    let cursor = new Date(start);

    for (let i = 0; i < days; i++) {
      dayList.push(cursor.toISOString().split("T")[0]);
      cursor.setDate(cursor.getDate() + 1);
    }

    // Fetch cars + calendar prices
    const cars = await prisma.car.findMany({
      where: {
        available: true,
        status: CarStatus.AVAILABLE,
        Reservation: {
          none: {
            status: { not: "cancelled" },
            AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
          },
        },
      },
      include: {
        CarCategory: true,
        CalendarPrice: true,
      },
    });

    const results = [];

    for (const car of cars) {
      // Default price (Prisma Decimal → number)
      const defaultDaily = Number(car.dailyPrice);

      // Build map YYYY-MM-DD → price
      const calendarMap = new Map<string, number>();

      for (const cp of car.CalendarPrice) {
        const key = cp.date.toISOString().split("T")[0];
        calendarMap.set(key, Number(cp.price));
      }

      // Build price breakdown
      const breakdown = dayList.map((dateKey) => ({
        date: dateKey,
        price: calendarMap.get(dateKey) ?? defaultDaily,
      }));

      // Sum total
      const totalPrice = breakdown.reduce((sum, d) => sum + d.price, 0);

      results.push({
        id: car.id,
        make: car.make,
        model: car.model,
        category: car.CarCategory?.name || "Uncategorized",
        seats: car.seats,
        fuelType: car.fuelType,
        transmission: car.transmission,
        image: car.imageUrl?.trim() || "/images/default-car.jpg",
        pricePerDay: defaultDaily,
        totalPrice,
        days,
        breakdown,
      });
    }

    console.log("Search results:", results);

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
