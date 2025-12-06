"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useTranslation } from "@/components/LanguageProvider";

export default function ContactPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold mb-4"
        >
          {t("contact.title")}
        </motion.h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
          {t("contact.subtitle")}
        </p>
      </section>

      {/* CONTACT INFO + FORM */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        {/* CONTACT DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-6">
            {t("contact.getInTouch")}
          </h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Phone className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">{t("contact.phone")}</h4>
                <p className="text-gray-600">+30 210 123 4567</p>
                <p className="text-gray-600">+30 694 123 4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">{t("contact.email")}</h4>
                <a
                  href="mailto:info@parasirisrental.gr"
                  className="text-blue-700 underline"
                >
                  info@parasirisrental.gr
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">{t("contact.address")}</h4>
                <p className="text-gray-600">
                  Vouliagmenis Avenue 245, Alimos 17456, Athens, Greece
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-700">{t("contact.hours")}</h4>
                <p className="text-gray-600">{t("contact.hours.value")}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONTACT FORM */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h3 className="text-2xl font-semibold text-blue-800 mb-6">
            {t("contact.form.title")}
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                {t("contact.form.name")}
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={t("contact.form.placeholder.name")}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={t("contact.form.placeholder.email")}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {t("contact.form.message")}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={t("contact.form.placeholder.message")}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
            >
              {t("contact.form.submit")}
            </button>
          </form>
        </motion.div>
      </section>

      {/* GOOGLE MAP SECTION */}
      <section className="w-full h-[450px] bg-gray-100">
        <iframe
          title="Parasiris Car Rental Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13020.428944490466!2d25.071384967795662!3d35.32815846965061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x149a56bb6cc4a44b%3A0x400bd2ce2b9b750!2zzpPOrM62zrk!5e0!3m2!1sen!2sgr!4v1762941688206!5m2!1sen!2sgr"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          className="border-0 rounded-t-2xl shadow-inner"
        ></iframe>
      </section>
    </main>
  );
}
