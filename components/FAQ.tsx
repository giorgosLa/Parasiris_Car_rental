"use client";

import { useTranslation } from "./LanguageProvider";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";

export default function FAQ() {
  const t = useTranslation();

  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-orange-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <FaQuestionCircle />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-orange-600 font-semibold">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("faq.title")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{t("faq.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {items.map((item, idx) => (
            <article
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white/90 shadow-sm hover:shadow-lg transition"
            >
              <div className="absolute -left-10 -top-10 w-24 h-24 bg-orange-50 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition" />
              <div className="p-5 flex gap-3">
                <div className="mt-1 text-orange-500">
                  <FaCheckCircle />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.q}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
