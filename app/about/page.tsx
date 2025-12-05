"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/components/LanguageProvider";

export default function AboutPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="relative flex flex-col items-center justify-center text-center py-24 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-4"
        >
          {t("about.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl text-lg text-blue-100"
        >
          {t("about.subtitle")}
        </motion.p>
      </section>

      <section className="container flex mx-auto px-6 py-16 gap-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h2 className="text-3xl font-semibold text-blue-900">
            {t("about.section1.title")}
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            {t("about.section1.p1")}
          </p>
          <p className="text-lg leading-relaxed text-gray-600">
            {t("about.section1.p2")}
          </p>
        </motion.div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-blue-900 mb-6"
          >
            {t("about.section2.title")}
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t("about.section2.card1.title"),
                desc: t("about.section2.card1.desc"),
              },
              {
                title: t("about.section2.card2.title"),
                desc: t("about.section2.card2.desc"),
              },
              {
                title: t("about.section2.card3.title"),
                desc: t("about.section2.card3.desc"),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition-all"
              >
                <h4 className="text-xl font-semibold text-blue-700 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
