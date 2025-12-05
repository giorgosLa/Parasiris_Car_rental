"use client";

import SearchBar from "@/components/SearchBar";
import { useTranslation } from "@/components/LanguageProvider";
import { FaMapMarkedAlt, FaCarSide, FaBolt, FaPhoneAlt } from "react-icons/fa";

const steps = [
  {
    icon: <FaMapMarkedAlt className="text-orange-500" />,
    titleKey: "book.step1.title",
    descKey: "book.step1.desc",
  },
  {
    icon: <FaCarSide className="text-orange-500" />,
    titleKey: "book.step2.title",
    descKey: "book.step2.desc",
  },
  {
    icon: <FaBolt className="text-orange-500" />,
    titleKey: "book.step3.title",
    descKey: "book.step3.desc",
  },
];

export default function BookPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50">
      <section className="relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/60 via-white to-blue-50" />
        <div className="absolute -top-10 -left-10 w-52 h-52 bg-orange-200/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 space-y-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.16em] text-orange-600 font-semibold">
              Book
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("book.title")}
            </h1>
            <p className="text-gray-700 mt-3 text-lg">
              {t("book.subtitle")}
            </p>
          </div>

          <SearchBar className="mt-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <div
                key={step.titleKey}
                className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-lg transition"
              >
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500" />
                <div className="p-5 flex gap-3 items-start">
                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 bg-white/90 border border-orange-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-50 text-green-600 border border-green-100">
                <FaPhoneAlt />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  +30 210 123 4567
                </p>
                <p className="text-xs text-gray-600">support@easyrental.gr</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 md:flex-1 text-center md:text-left">
              {t("book.support")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
