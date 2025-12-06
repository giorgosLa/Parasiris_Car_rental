"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import type { StripeSessionData } from "@/types/payment";
import Image from "next/image";
import { useTranslation } from "@/components/LanguageProvider";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const t = useTranslation();

  const { selectedCar, criteria, clearBooking } = useBookingStore();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<StripeSessionData | null>(null);

<<<<<<< HEAD
  // ---- VERIFY PAYMENT ----
=======
  // -------------------------------------
  // POLLING + FETCH FINAL PAYMENT DETAILS
  // -------------------------------------
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

<<<<<<< HEAD
    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `/api/payments/session?session_id=${sessionId}`
        );
        const data: StripeSessionData = await res.json();

        if (!res.ok || data.status !== "paid") {
          router.push("/checkout");
          return;
        }

        setPayment(data);
        setTimeout(() => clearBooking(), 500);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [clearBooking, router, sessionId]);

  // ---- Loading UI ----
  if (loading) {
=======
    let attempts = 0;
    const maxAttempts = 15; // ~30 seconds

    const interval = setInterval(async () => {
      attempts++;

      const res = await fetch(`/api/payments/status?session_id=${sessionId}`);
      const data = await res.json();

      console.log("🔄 Polling:", data);

      // --- SUCCESS ---
      if (data.status === "confirmed") {
        clearInterval(interval);

        // Fetch full Stripe session data
        const verify = await fetch(
          `/api/payments/session?session_id=${sessionId}`
        );

        const sessionData: StripeSessionData = await verify.json();
        setPayment(sessionData);

        clearBooking();
        setLoading(false);
        return;
      }

      // --- FAILED ---
      if (data.status === "failed") {
        clearInterval(interval);
        router.push("/failed");
        return;
      }

      // --- TOO MANY ATTEMPTS ---
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        router.push("/failed");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, router, clearBooking]);

  // -----------------------
  // LOADING STATE
  // -----------------------
  if (loading || !payment) {
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
    return (
      <div className="p-20 text-center text-gray-500 text-lg">
        {t("success.verifying")}
      </div>
    );
  }

<<<<<<< HEAD
  if (!payment) {
    return (
      <div className="p-20 text-center text-red-600 text-lg">
        {t("success.failed")}
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      {/* HEADER */}
=======
  // -----------------------
  // SUCCESS UI
  // -----------------------
  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
      <h1 className="text-4xl font-bold text-green-600 text-center mb-6">
        {t("success.title")}
      </h1>
      <p className="text-center text-gray-600 mb-10 text-lg">
        {t("success.subtitle")}
      </p>

      <div className="bg-white p-8 rounded-2xl shadow-xl border space-y-10">
        {/* CAR SECTION */}
        {selectedCar && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("success.carDetails")}
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

<<<<<<< HEAD
        {/* BOOKING SECTION */}
=======
        {/* BOOKING INFO */}
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
        {criteria && (
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {t("success.bookingInfo")}
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

        {/* PAYMENT INFO */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t("success.paymentDetails")}
          </h2>

          <div className="space-y-2 text-gray-700 bg-gray-50 p-4 rounded-xl border">
            <p>
              <strong>{t("success.paymentId")}</strong> {payment.id}
            </p>
            <p>
              <strong>{t("success.status")}</strong>{" "}
              <span className="text-green-600">{payment.status}</span>
            </p>
            <p>
              <strong>{t("success.amount")}</strong> €
              {(payment.amount_total / 100).toFixed(2)}
            </p>

            {payment.receipt_url && (
              <a
                href={payment.receipt_url}
                target="_blank"
                className="text-blue-600 underline block mt-2"
              >
                {t("success.receipt")}
              </a>
            )}
          </div>
        </section>

<<<<<<< HEAD
        {/* ACTION BUTTONS */}
=======
        {/* BUTTONS */}
>>>>>>> 633b30a68a2fe01490639401b60ab81c5bc6d1c1
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
          >
            {t("success.backHome")}
          </button>
        </div>
      </div>
    </main>
  );
}
