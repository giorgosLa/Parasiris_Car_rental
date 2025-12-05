"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";

export default function TermsPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-4"
        >
          {t("terms.title")}
        </motion.h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          {t("terms.subtitle")}
        </p>
      </section>

      <section className="container mx-auto px-6 py-16 max-w-4xl space-y-12">
        {/* === BOOKING TERMS === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-4">
            {t("terms.booking.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t("terms.booking.p1")}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>{t("terms.booking.li1")}</li>
            <li>{t("terms.booking.li2")}</li>
            <li>{t("terms.booking.li3")}</li>
            <li>{t("terms.booking.li4")}</li>
            <li>{t("terms.booking.li5")}</li>
          </ul>
          <p className="mt-4 text-gray-700">
            {t("terms.booking.p2")}
          </p>
        </motion.div>

        {/* === GENERAL TERMS === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-4">
            {t("terms.general.title")}
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>{t("terms.general.li1")}</li>
            <li>{t("terms.general.li2")}</li>
            <li>{t("terms.general.li3")}</li>
            <li>{t("terms.general.li4")}</li>
            <li>{t("terms.general.li5")}</li>
            <li>{t("terms.general.li6")}</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mt-8 mb-3">
            {t("terms.insurance.title")}
          </h3>
          <p className="text-gray-700 mb-3">
            {t("terms.insurance.p1")}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>{t("terms.insurance.li1")}</li>
            <li>{t("terms.insurance.li2")}</li>
          </ul>

          <h3 className="text-2xl font-semibold text-blue-700 mt-8 mb-3">
            {t("terms.fuel.title")}
          </h3>
          <p className="text-gray-700">{t("terms.fuel.p1")}</p>
        </motion.div>

        {/* === LOCAL TERMS GREECE === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-4">
            {t("terms.local.title")}
          </h2>

          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li>{t("terms.local.li1")}</li>
            <li>{t("terms.local.li2")}</li>
            <li>{t("terms.local.li3")}</li>
            <li>{t("terms.local.li4")}</li>
            <li>{t("terms.local.li5")}</li>
            <li>{t("terms.local.li6")}</li>
          </ul>

          <p className="mt-4 text-gray-700">
            {t("terms.contact")}{" "}
            <a href="mailto:info@parasirisrental.gr" className="text-blue-700 underline">
              info@easyrental.gr
            </a>
            .
          </p>
        </motion.div>
      </section>
    </main>
  );
}
