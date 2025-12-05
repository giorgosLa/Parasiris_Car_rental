"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaUsers,
  FaCogs,
  FaGasPump,
  FaSnowflake,
  FaDoorOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSearchStore } from "@/store/searchStore";
import { useBookingStore } from "@/store/bookingStore";
import { CarResult } from "@/types/car";

export default function CarDetailsPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();

  const { results, criteria } = useSearchStore();
  const { setSelectedCar } = useBookingStore();

  // If refreshing and no store data:
  if (!results || !criteria) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
        No car data found. Please start from the homepage.
      </div>
    );
  }

  // Typed version of car
  const car = results.find((c): c is CarResult => String(c.id) === id);

  if (!car) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
        Car not found.
      </div>
    );
  }

  const imageUrl = car.image?.trim() || "/images/default-car.jpg";
  const doors = car.doors ?? 5;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Back to results
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* LEFT = Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:w-1/2 flex justify-center"
        >
          <Image
            src={imageUrl}
            alt={`${car.make} ${car.model}`}
            width={500}
            height={350}
            className="rounded-xl shadow-md object-contain bg-white p-4"
          />
        </motion.div>

        {/* RIGHT = Details */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:w-1/2"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {car.make} {car.model}
          </h1>

          <p className="text-gray-500 mb-4 text-sm">
            Category: <span className="font-medium">{car.category ?? "—"}</span>
          </p>

          {/* PRICE */}
          <div className="bg-gray-100 rounded-xl p-5 shadow-sm mb-6 border">
            <p className="text-xl font-bold text-gray-900">
              Total: €{car.totalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              {car.days} days · €{car.pricePerDay}/day
            </p>
          </div>

          {/* SPECS GRID */}
          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
            <Spec icon={<FaUsers />} text={`${car.seats} Seats`} />
            <Spec icon={<FaDoorOpen />} text={`${doors} Doors`} />
            <Spec icon={<FaCogs />} text={car.transmission} />
            <Spec icon={<FaGasPump />} text={car.fuelType} />
            <Spec icon={<FaSnowflake />} text={"A/C Included"} />
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              setSelectedCar(car);
              router.push("/insurance");
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg"
          >
            Proceed to Booking
          </button>
        </motion.div>
      </div>

      {/* Pricing Breakdown */}
      {car.breakdown && car.breakdown.length > 0 && (
        <section className="mt-12 bg-white rounded-xl p-6 shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Price Breakdown
          </h3>

          <div className="space-y-2 text-sm">
            {car.breakdown.map((line, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2 text-gray-700"
              >
                <span>{line.date}</span>
                <span>€{line.price}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Spec({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-blue-600">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
