"use client";

import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "./LanguageProvider";

export default function Footer() {
  const t = useTranslation();

  return (
    <footer className="bg-[#0b1224] text-gray-200 pt-14 pb-10 px-4 mt-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logos/logo.svg"
              alt="Logo"
              width={180}
              height={180}
              className="h-auto"
            />
          </Link>
          <p className="text-sm text-gray-400">{t("footer.description")}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wide text-gray-400">
              {t("footer.follow")}
            </span>
            <div className="flex items-center gap-3 text-gray-300">
              <a href="#" className="hover:text-orange-400" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-orange-400" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-orange-400" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="hover:text-orange-400" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
            {t("footer.explore")}
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/about" className="hover:text-orange-400">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-orange-400">
                {t("nav.terms")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-400">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide mb-4">
            {t("footer.locations")}
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{t("footer.location.herAirport")}</li>
            <li>{t("footer.location.chnAirport")}</li>
            <li>{t("footer.location.herPort")}</li>
            <li>{t("footer.location.rethymno")}</li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t("footer.support")}
          </h3>
          <p className="text-sm text-gray-300">{t("footer.call")}</p>
          <div className="text-sm font-semibold text-white">
            +30 210 123 4567
          </div>
          <div className="text-sm text-gray-300">support@easyrental.gr</div>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-md shadow-orange-300/30 transition"
          >
            {t("footer.book")}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <span>{t("footer.copy")}</span>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-orange-400">
            {t("footer.terms")}
          </Link>
          <Link href="/contact" className="hover:text-orange-400">
            {t("footer.contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
