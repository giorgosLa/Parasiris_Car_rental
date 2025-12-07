"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useBookingStore } from "@/store/bookingStore";
import type { InsurancePlan } from "@/types/insurance";
import { useSearchStore, type SearchCriteria } from "@/store/searchStore";

import type { CarResult } from "@/types/car";
import { useTranslation } from "@/components/LanguageProvider";

/* ------------------------------ HELPERS ------------------------------ */

function toNumber(value: unknown): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

/* ------------------------------ MAIN PAGE ------------------------------ */

export default function CheckoutPage() {
  const router = useRouter();
  const t = useTranslation();

  const {
    selectedCar,
    selectedInsurance,
    criteria: criteriaFromBooking,
  } = useBookingStore();

  // fallback σε Search Store (σε περίπτωση refresh)
  const fallbackCriteria = useSearchStore.getState().criteria;
  const criteria: SearchCriteria | null =
    criteriaFromBooking ?? fallbackCriteria;

  const [driver, setDriver] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });

  const [submitting, setSubmitting] = useState(false);

  /* ------------------ REDIRECT IF MISSING DATA ------------------ */

  useEffect(() => {
    if (!selectedCar) router.push("/cars");
    if (!selectedInsurance) router.push("/insurance");
  }, [selectedCar, selectedInsurance, router]);

  if (!selectedCar || !selectedInsurance || !criteria) {
    return (
      <div className="p-10 text-center text-gray-500">
        {t("checkout.loading")}
      </div>
    );
  }

  /* ------------------ PRICE CALCULATION ------------------ */

  const carTotal = toNumber(selectedCar.totalPrice);
  const days = toNumber(selectedCar.days) || 1;

  const insuranceDaily = toNumber(selectedInsurance.dailyPrice);
  const insuranceCost = insuranceDaily * days;

  const finalTotal = carTotal + insuranceCost;

  /* ------------------ SUBMIT PAYMENT ------------------ */

  const handleSubmit = async () => {
    if (!driver.name || !driver.email || !driver.phone) {
      alert(t("checkout.required"));
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: finalTotal,
          car: selectedCar, // already CarResult type
          insurance: {
            ...selectedInsurance,
            dailyPrice: Number(selectedInsurance.dailyPrice),
          },
          criteria,
          driver,
        }),
      });

      const data = await res.json();
      console.log("Checkout session response:", data.insurance);
      if (!res.ok || !data.url) {
        alert(t("checkout.failed"));
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(t("checkout.error"));
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------ JSX ------------------------------ */

  return (
    <div className="max-w-6xl mx-auto pt-10 pb-20 px-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">
        {t("checkout.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT SIDE FORMS */}
        <div className="md:col-span-2 space-y-10">
          {/* DRIVER INFO */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              {t("checkout.driver")}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label={t("checkout.inputs.name")}
                value={driver.name}
                onChange={(e) => setDriver({ ...driver, name: e.target.value })}
              />
              <Input
                label={t("checkout.inputs.email")}
                value={driver.email}
                onChange={(e) =>
                  setDriver({ ...driver, email: e.target.value })
                }
              />
              <Input
                label={t("checkout.inputs.phone")}
                value={driver.phone}
                onChange={(e) =>
                  setDriver({ ...driver, phone: e.target.value })
                }
              />
            </div>
          </section>

          {/* ADDRESS INFO */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              {t("checkout.address")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("checkout.inputs.address")}
                value={driver.address}
                onChange={(e) =>
                  setDriver({ ...driver, address: e.target.value })
                }
              />
              <Input
                label={t("checkout.inputs.city")}
                value={driver.city}
                onChange={(e) => setDriver({ ...driver, city: e.target.value })}
              />
              <Input
                label={t("checkout.inputs.country")}
                value={driver.country}
                onChange={(e) =>
                  setDriver({ ...driver, country: e.target.value })
                }
              />
              <Input
                label={t("checkout.inputs.zip")}
                value={driver.zip}
                onChange={(e) => setDriver({ ...driver, zip: e.target.value })}
              />
            </div>
          </section>

          {/* PAYMENT METHOD */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              {t("checkout.payment")}
            </h2>
            <div className="p-4 border rounded-xl bg-blue-50 text-blue-700">
              {t("checkout.paymentMethod")}
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-lg font-semibold py-4 rounded-xl"
          >
            {submitting
              ? t("checkout.processing")
              : `${t("checkout.payNow")} (€${finalTotal.toFixed(2)})`}
          </button>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <SummaryCard
          car={selectedCar}
          insurance={selectedInsurance}
          criteria={criteria}
          insuranceCost={insuranceCost}
          total={finalTotal}
          carTotal={carTotal}
        />
      </div>
    </div>
  );
}

/* ------------------------------ SMALL COMPONENTS ------------------------------ */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function SummaryCard({
  car,
  insurance,
  criteria,
  insuranceCost,
  total,
  carTotal,
}: {
  car: CarResult;
  insurance: InsurancePlan;
  criteria: SearchCriteria;
  insuranceCost: number;
  total: number;
  carTotal: number;
}) {
  const t = useTranslation();
  const imageUrl = (car.image || "").trim();

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 sticky top-10 h-fit">
      <h3 className="text-xl font-semibold mb-4">{t("checkout.summary")}</h3>

      {imageUrl && (
        <Image
          src={imageUrl}
          width={350}
          height={220}
          className="rounded-lg object-contain mb-4"
          alt={car.make}
        />
      )}

      <p className="font-semibold text-gray-800">{car.make}</p>
      <p className="text-sm text-gray-500 mb-4">{car.category}</p>

      <div className="border-t pt-4 text-sm space-y-2">
        <p>
          <strong>{t("checkout.pickup")}: </strong> {criteria.pickupLocation}
        </p>
        <p>
          <strong>{t("checkout.dropoff")}: </strong> {criteria.dropoffLocation}
        </p>
        <p className="text-gray-600 text-xs">
          {criteria.pickupDate} {criteria.pickupTime} → {criteria.dropoffDate}{" "}
          {criteria.dropoffTime}
        </p>
      </div>

      <div className="border-t pt-4 text-sm space-y-1">
        <p>
          <strong>{t("checkout.carRental")}</strong> €{carTotal.toFixed(2)}
        </p>
        <p>
          <strong>{insurance.title}:</strong> €{insuranceCost.toFixed(2)}
        </p>
      </div>

      <div className="border-t pt-4 mt-4">
        <p className="text-xl font-bold text-gray-900">
          {t("checkout.total")} €{total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
