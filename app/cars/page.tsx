"use client";

import { useSearchStore } from "@/store/searchStore";
import { useBookingStore } from "@/store/bookingStore";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import {
  FaUsers,
  FaDoorOpen,
  FaCogs,
  FaGasPump,
  FaSnowflake,
  FaCheckCircle,
} from "react-icons/fa";
import { useTranslation } from "@/components/LanguageProvider";
import { useRouter } from "next/navigation";
import type { CarResult } from "@/types/car";

export default function CarsPage() {
  const router = useRouter();
  const t = useTranslation();
  const { criteria, results } = useSearchStore();
  const { setSelectedCar } = useBookingStore();

  // Αν χάσαμε τα δεδομένα (π.χ. πρώτη επίσκεψη / καθαρό localStorage)
  if (!results || !criteria) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <div className="bg-white/80 border border-orange-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t("cars.noSearchTitle")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("cars.noSearchSubtitle")}
            </p>
            <SearchBar className="mt-6 mb-0" />
          </div>
        </div>
      </div>
    );
  }

  // Debug (μόνο για σένα)
  console.log("RESULTS RECEIVED FROM STORE:", results);

  // Χτίζουμε τα cars για το UI, αλλά κρατάμε και το raw item
  const cars = results.map((item: CarResult) => {
    const totalPrice = Number(item.totalPrice);
    const pricePerDay = Number(item.pricePerDay);

    return {
      raw: item,
      id: item.id,
      name: `${item.make} ${item.model}`,
      type: item.category || "Unknown",
      transmission: item.transmission,
      fuel: item.fuelType,
      seats: item.seats,
      doors: 5,
      price: isNaN(totalPrice) ? 0 : totalPrice,
      perDay: isNaN(pricePerDay) ? "0.00" : pricePerDay.toFixed(2),
      image: item.image?.trim() || "/images/no-car.png",
    };
  });

  const filteredCars = cars;

  const start = new Date(criteria.pickupDate);
  const end = new Date(criteria.dropoffDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50">
      <div className="bg-white/70 backdrop-blur border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-orange-600 font-semibold">
                  {t("cars.tripLabel")}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t("cars.carsIn", { location: criteria.pickupLocation })}
                </h1>
                <p className="text-sm text-gray-700 mt-1">
                  {criteria.pickupDate} at {criteria.pickupTime} →{" "}
                  {criteria.dropoffDate} at {criteria.dropoffTime} · {days}{" "}
                  {days === 1 ? "day" : "days"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
                <span className="px-3 py-2 bg-white border border-orange-100 rounded-full shadow-sm">
                  {t("cars.freeCancellation")}
                </span>
                <span className="px-3 py-2 bg-white border border-orange-100 rounded-full shadow-sm">
                  {t("cars.instantConfirm")}
                </span>
                <span className="px-3 py-2 bg-white border border-orange-100 rounded-full shadow-sm">
                  {t("cars.supportBadge")}
                </span>
              </div>
            </div>

            <SearchBar initialCriteria={criteria} className="mt-2 mb-2" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-white/80 border border-orange-100 rounded-2xl shadow-sm p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <Detail label={t("cars.pickup")} value={criteria.pickupLocation} />
              <Detail
                label={t("cars.dates")}
                value={`${criteria.pickupDate} → ${criteria.dropoffDate}`}
                helper={`${criteria.pickupTime} → ${criteria.dropoffTime}`}
              />
              <Detail
                label={t("cars.duration")}
                value={`${days} ${days === 1 ? "day" : "days"}`}
                helper={t("cars.bestPrices")}
              />
            </div>
          </div>
        </div>

        {/* CARS LIST */}
        {filteredCars.length === 0 ? (
          <div className="bg-white/80 border border-orange-100 rounded-2xl shadow-sm p-10 text-center text-gray-700">
            {t("cars.noCars")}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* IMAGE */}
                  <div className="relative md:w-5/12 bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-6">
                    <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 border border-orange-100 text-orange-600">
                      {car.type}
                    </div>
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={420}
                      height={260}
                      className="object-contain drop-shadow-md"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 p-5 md:p-6 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {car.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {t("cars.orSimilar", { type: car.type })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
                          {t("cars.availableForDates")}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-black text-white">
                          {t("cars.fullInsurance")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <Info icon={<FaUsers />} text={`${car.seats} seats`} />
                      <Info icon={<FaDoorOpen />} text={`${car.doors} doors`} />
                      <Info icon={<FaCogs />} text={car.transmission} />
                      <Info icon={<FaGasPump />} text={car.fuel} />
                      <Info icon={<FaSnowflake />} text="A/C" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex flex-col gap-2 text-sm text-green-700 font-semibold">
                        <Perk text={t("cars.perk1")} />
                        <Perk text={t("cars.perk2")} />
                        <Perk text={t("cars.perk3")} />
                      </div>

                      <div className="md:w-56 bg-gray-50 border border-gray-200 rounded-xl p-4 text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          €{car.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {t("cars.pricePerDay", {
                            price: `€${car.perDay}`,
                            days,
                          })}
                        </p>

                        <button
                          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-4 py-2 rounded-full transition shadow-md shadow-orange-200"
                          onClick={() => {
                            // κρατάμε ΟΛΟ το raw αντικείμενο στο booking store
                            setSelectedCar(car.raw);
                            router.push(`/cars/${car.id}`);
                          }}
                        >
                          {t("cars.viewDeal")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
      {helper && <p className="text-xs text-gray-600 mt-1">{helper}</p>}
    </div>
  );
}

function Info({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
      <span className="text-gray-700">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Perk({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <FaCheckCircle className="text-green-500" />
      <span>{text}</span>
    </div>
  );
}
