import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CarStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pickupDate, dropoffDate, pickupLocation, pickupTime, dropoffTime } =
      body;

    if (!pickupDate || !dropoffDate || !pickupLocation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate rental days
    const start = new Date(`${pickupDate}T${pickupTime || "00:00"}`);
    const end = new Date(`${dropoffDate}T${dropoffTime || "23:59"}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid dates provided" },
        { status: 400 }
      );
    }

    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    const cars = await prisma.car.findMany({
      where: {
        available: true,
        status: CarStatus.AVAILABLE,
        NOT: {
          Booking: {
            some: {
              AND: [
                { startDate: { lt: end } }, // booking starts before dropoff
                { endDate: { gt: start } }, // booking ends after pickup
              ],
            },
          },
        },
      },
      include: {
        CarCategory: true,
        CarImage: true,
        Booking: {
          select: { id: true },
          where: {
            startDate: { lt: end },
            endDate: { gt: start },
          },
        },
      },
    });

    const formatted = cars.map((car) => {
      // FIX → Prisma Decimal MUST be converted using .toString()
      const daily = Number(car.dailyPrice.toString());

      const total = daily * days;

      return {
        id: car.id,
        make: car.make,
        model: car.model,
        category: car.CarCategory?.name || "Uncategorized",
        seats: car.seats,
        doors: 5,
        fuelType: car.fuelType,
        transmission: car.transmission,

        image:
          car.imageUrl?.trim() ||
          car.CarImage?.[0]?.imageUrl?.trim() ||
          "/images/default-car.jpg",

        dailyPrice: daily,
        pricePerDay: daily,
        totalPrice: total,
        days,
      };
    });

    console.log("API RETURN:", formatted);
    return NextResponse.json(formatted);
  } catch (error: unknown) {
    console.error("Search error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
