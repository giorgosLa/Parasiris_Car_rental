import CarCard, { Car } from "./CarCard";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type FleetCar = Prisma.CarGetPayload<{
  include: { CarCategory: true };
}>;

export const revalidate = 0;
export const dynamic = "force-dynamic";

function mapCarToCard(car: FleetCar): Car {
  const image =
    car.imageUrl?.trim() ||
    "/images/no-car.png";

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
    <section className=" relative container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Our Fleet
      </h2>

      {fleetCards.length === 0 ? (
        <p className="text-gray-600">No vehicles found in the database.</p>
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
