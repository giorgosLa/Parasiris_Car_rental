"use client";

import Image from "next/image";
import {
  Users,
  Fuel,
  Cog,
  Info,
  CalendarRange,
  Hash,
  BadgeCheck,
  Euro,
} from "lucide-react";
import { useTranslation } from "./LanguageProvider";

export type Car = {
  id: string;
  name: string;
  category: string;
  categoryDescription?: string | null;
  seats: number;
  fuelType: string;
  transmission: string;
  year: number;
  licensePlate: string;
  image: string;
  dailyPrice: number;
  status: string;
  available: boolean;
};

export default function CarCard({ car }: { car: Car }) {
  const t = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col hover:shadow-2xl transition">
      {/* Title */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">{car.category}</span>
              <Info className="w-4 h-4 text-gray-400" />
            </span>
            {car.categoryDescription && (
              <>
                <span>•</span>
                <span>{car.categoryDescription}</span>
              </>
            )}
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            car.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {car.available
            ? `${t("car.available")}`
            : `${t("car.unavailable")}`}
        </span>
      </div>

      {/* Image wrapper MUST be relative + fixed height */}
      <div className="relative my-6 h-40 md:h-48 lg:h-52">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>

      {/* Specs */}
      <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
        <Spec
          icon={<Users className="w-4 h-4" />}
          label={t("car.seats", { count: car.seats })}
        />
        <Spec icon={<Fuel className="w-4 h-4" />} label={t("car.fuel", { fuel: car.fuelType })} />
        <Spec icon={<Cog className="w-4 h-4" />} label={t("car.transmission", { transmission: car.transmission })} />
        <Spec
          icon={<CalendarRange className="w-4 h-4" />}
          label={t("car.year", { year: car.year })}
        />
        <Spec icon={<Hash className="w-4 h-4" />} label={t("car.license", { plate: car.licensePlate })} />
        <Spec
          icon={<Euro className="w-4 h-4" />}
          label={t("car.daily", { price: car.dailyPrice.toFixed(2) })}
        />
        <Spec
          icon={<BadgeCheck className="w-4 h-4" />}
          label={t("car.status", { status: car.status })}
        />
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-gray-600">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
