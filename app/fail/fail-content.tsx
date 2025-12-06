"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import type { StripeSessionData } from "@/types/payment";
import Image from "next/image";
import { useTranslation } from "@/components/LanguageProvider";

export default function FailedContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const t = useTranslation();

  const { selectedCar, criteria, clearBooking } = useBookingStore();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<StripeSessionData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    let attempts = 0;
    const maxAttempts = 15; // ~30 seconds

    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/payments/status?session_id=${sessionId}`);
        const data = await res.json();

        console.log("[fail-page] status poll:", data);

        if (data.status === "failed") {
          clearInterval(interval);
          try {
            const sessionRes = await fetch(
              `/api/payments/session?session_id=${sessionId}`
            );
            if (sessionRes.ok) {
              const sessionData: StripeSessionData = await sessionRes.json();
              setPayment(sessionData);
            }
          } catch (err) {
            console.error("Failed to fetch session for failed payment:", err);
          }
          setLoading(false);
          setTimeout(() => clearBooking(), 500);
          return;
        }

        if (data.status === "confirmed") {
          clearInterval(interval);
          router.push(`/success?session_id=${sessionId}`);
          return;
        }
      } catch (err) {
        console.error("Payment polling error:", err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, router, clearBooking]);

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500 text-lg">
        {t("failed.verifying")}
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-red-600 text-center mb-6">
        {t("failed.title")}
      </h1>
      <p className="text-center text-gray-600 mb-10 text-lg">
        {t("failed.subtitle")}
      </p>

      <div className="bg-white p-8 rounded-2xl shadow-xl border space-y-10">
        {/* CAR INFO IF SELECTED */}
        {selectedCar && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("failed.carDetails")}
            </h2>

            <div className="flex gap-6 items-center border p-4 rounded-xl bg-gray-50">
              <Image
                src={selectedCar.image}
                alt={selectedCar.make}
                width={160}
                height={110}
                className="rounded-xl object-contain"
              />

              <div>
                <p className="text-xl font-semibold">{selectedCar.make}</p>
                <p className="text-gray-600">{selectedCar.category}</p>
                <p className="text-gray-800 font-medium mt-2">
                  Total Price: €{selectedCar.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* BOOKING CRITERIA IF EXISTS */}
        {criteria && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("failed.bookingInfo")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 border rounded-xl">
                <p className="font-semibold text-gray-800 mb-1">
                  {t("checkout.pickup")}
                </p>
                <p>{criteria.pickupLocation}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {criteria.pickupDate} – {criteria.pickupTime}
                </p>
              </div>

              <div className="bg-gray-50 p-4 border rounded-xl">
                <p className="font-semibold text-gray-800 mb-1">
                  {t("checkout.dropoff")}
                </p>
                <p>{criteria.dropoffLocation}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {criteria.dropoffDate} – {criteria.dropoffTime}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* PAYMENT FAILED INFO */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t("failed.paymentDetails")}
          </h2>

          <div className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded-xl border">
            <p className="text-red-600 font-semibold">
              {t("failed.statusMessage")}
            </p>

            {payment && (
              <>
                <p>
                  <strong>{t("failed.paymentId")}</strong> {payment.id}
                </p>
                <p>
                  <strong>{t("failed.status")}</strong>{" "}
                  <span className="text-red-600">{payment.status}</span>
                </p>
              </>
            )}

            <p className="text-sm text-gray-500 mt-1">{t("failed.helpText")}</p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => router.push("/checkout")}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-xl"
          >
            {t("failed.retry")}
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl"
          >
            {t("failed.backHome")}
          </button>
        </div>
      </div>
    </main>
  );
}
