"use client";

import { useInsurancePlans } from "@/hooks/useInsurancePlans";
import { useBookingStore } from "@/store/bookingStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Car, Shield } from "lucide-react";
import { useEffect } from "react";
import type { InsurancePlan as PrismaInsurancePlan } from "@prisma/client";
import { useTranslation } from "@/components/LanguageProvider";

/* -------------------- HELPERS -------------------- */

function normalizePlan(plan: PrismaInsurancePlan) {
  return {
    ...plan,
    dailyPrice: Number(plan.dailyPrice),
    excessAmount:
      plan.excessAmount !== null && plan.excessAmount !== undefined
        ? Number(plan.excessAmount)
        : null,
  };
}

function getPlanType(plan: PrismaInsurancePlan): "standard" | "premium" {
  const hasLowOrNoExcess =
    plan.excessAmount === null ||
    plan.excessAmount === undefined ||
    Number(plan.excessAmount) <= 100;

  const fullCoverage =
    plan.includesWindScreen &&
    plan.includesTheftCover &&
    plan.roadsideAssistance;

  return hasLowOrNoExcess && fullCoverage ? "premium" : "standard";
}

const Feature = ({ enabled, label }: { enabled: boolean; label: string }) => (
  <li className="flex items-center gap-2 text-sm">
    {enabled ? (
      <CheckCircle size={16} className="text-green-600" />
    ) : (
      <XCircle size={16} className="text-red-500" />
    )}
    {label}
  </li>
);

/* -------------------- PAGE -------------------- */

export default function InsurancePage() {
  const router = useRouter();
  const { plans, loading } = useInsurancePlans();

  const { selectedCar, setSelectedInsurance } = useBookingStore();
  const t = useTranslation();

  // If no car selected → redirect
  useEffect(() => {
    if (!selectedCar) router.push("/cars");
  }, [selectedCar, router]);

  if (!selectedCar)
    return (
      <div className="p-10 text-center text-gray-500">
        {t("insurance.redirect")}
      </div>
    );

  if (loading)
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-600">
        {t("insurance.loading")}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900">
          {t("insurance.title")}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">{t("insurance.subtitle")}</p>
      </motion.div>

      {/* PLANS LIST */}
      <div className="flex flex-col gap-8">
        {plans.map((rawPlan, index) => {
          const plan = normalizePlan(rawPlan); // FIXED HERE
          const type = getPlanType(rawPlan);
          const isPremium = type === "premium";

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="relative border rounded-2xl p-6 shadow-sm bg-white hover:shadow-xl transition cursor-pointer group"
              onClick={() => {
                setSelectedInsurance(plan); // now normalized
                router.push("/checkout");
              }}
            >
              {/* BADGE */}
              {index === 0 && isPremium && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 rounded-bl-xl rounded-tr-2xl text-xs font-bold shadow">
                  {t("insurance.mostPopular")}
                </div>
              )}

              {/* TITLE */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-700">
                    <Shield size={26} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-blue-700">
                      {plan.title}
                    </h2>
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${
                    isPremium ? "bg-purple-600" : "bg-gray-700"
                  }`}
                >
                  {isPremium ? t("insurance.premium") : t("insurance.standard")}
                </span>
              </div>

              {/* PRICE BOX */}
              <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
                <p className="flex items-center gap-2 text-gray-700 text-sm">
                  <Car size={16} className="text-blue-600" />
                  {t("insurance.dailyPrice")}
                  <span className="font-semibold">€{plan.dailyPrice}</span>
                </p>

                <p className="flex items-center gap-2 mt-2 text-gray-700 text-sm">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  {t("insurance.excess")}
                  <span className="font-semibold">
                    {plan.excessAmount !== null
                      ? `€${plan.excessAmount}`
                      : t("insurance.noExcess")}
                  </span>
                </p>
              </div>

              {/* FEATURES LIST */}
              <ul className="mt-5 text-gray-700 space-y-2">
                <Feature
                  enabled={plan.includesWindScreen}
                  label={t("insurance.features.wind")}
                />
                <Feature
                  enabled={plan.includesTheftCover}
                  label={t("insurance.features.theft")}
                />
                <Feature
                  enabled={plan.roadsideAssistance}
                  label={t("insurance.features.roadside")}
                />
              </ul>

              {/* CTA BUTTON */}
              <div className="mt-6 text-right">
                <button className="bg-blue-600 group-hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition">
                  {t("insurance.select")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BACK BUTTON */}
      <button
        className="mt-10 text-gray-500 hover:text-gray-700 hover:underline transition text-sm"
        onClick={() => router.back()}
      >
        {t("insurance.goBack")}
      </button>
    </div>
  );
}
