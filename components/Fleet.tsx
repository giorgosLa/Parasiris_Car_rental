import CarCard, { Car } from "./CarCard";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type FleetCar = Prisma.CarGetPayload<{
  include: { CarCategory: true };
}>;

export const revalidate = 0;
export const dynamic = "force-dynamic";

function mapCarToCard(car: FleetCar): Car {
  const image = car.imageUrl?.trim() || "/images/no-car.png";

  return {
    id: car.id.toString(),
    name: `${car.make} ${car.model}`,
    category: car.CarCategory?.name ?? "Uncategorized",
    categoryDescription: car.CarCategory?.description ?? null,
    seats: car.seats,
    fuelType: car.fuelType,
    transmission: car.transmission,
    year: car.year,
    licensePlate: car.licensePlate,
    image: image.trim(),
    dailyPrice: Number(car.dailyPrice),
    status: car.status,
    available: car.available,
  };
}

export default async function Fleet() {
  const cars = await prisma.car.findMany({
    include: { CarCategory: true },
    orderBy: [{ make: "asc" }, { model: "asc" }],
  });

  const fleetCards = cars.map(mapCarToCard);

  return (
    <section className="relative container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-blue-50 opacity-70 -z-10 rounded-[32px]" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.08em] text-orange-500 font-semibold">
            Premium Selection / Premium επιλογή
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Fleet / Ο στόλος μας
          </h2>
        </div>
      </div>

      {fleetCards.length === 0 ? (
        <p className="text-gray-600">
          No vehicles found / Δεν βρέθηκαν οχήματα.
        </p>
      ) : (
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {fleetCards.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </section>
  );
}
