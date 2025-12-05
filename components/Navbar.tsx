"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.terms"), href: "/terms" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 left-0 w-full z-50 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logos/logo.svg"
            alt="CarRental Logo"
            width={140}
            height={140}
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-orange-600 transition font-medium text-sm"
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-1 text-xs font-semibold">
            <LangButton active={lang === "en"} onClick={() => setLang("en")}>
              EN
            </LangButton>
            <LangButton active={lang === "el"} onClick={() => setLang("el")}>
              EL
            </LangButton>
          </div>

          <Link
            href="/book"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-full font-semibold shadow-md shadow-orange-200 transition text-sm"
          >
            {t("nav.book")}
          </Link>
        </div>

        {/* Mobile Menu Button (right) */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-full border border-gray-200 shadow-sm text-gray-800 hover:text-orange-600"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`absolute left-2 right-2 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "top-1/2 rotate-45" : "top-3"
            }`}
          />
          <span
            className={`absolute left-2 right-2 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "opacity-0" : "top-1/2"
            }`}
          />
          <span
            className={`absolute left-2 right-2 h-0.5 bg-current transition-all duration-300 ${
              isOpen ? "top-1/2 -rotate-45" : "bottom-3"
            }`}
          />
        </motion.button>
      </div>

      {/* Mobile Overlay + Drawer with animations */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-out Drawer */}
            <motion.aside
              key="drawer"
              className="fixed top-0 left-0 h-screen w-3/4 max-w-sm bg-white shadow-2xl z-50 flex flex-col text-gray-900"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 16 }}
              role="dialog"
              aria-modal="true"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src="/logos/logo.svg"
                    alt="CarRental Logo"
                    width={160}
                    height={160}
                  />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-orange-600"
                  aria-label="Close menu"
                >
                  <span className="text-xl font-bold">×</span>
                </button>
              </div>

              {/* Links */}
              <motion.div
                className="flex-1 overflow-y-auto px-6 py-6"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                  },
                }}
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: 24 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      className="block text-lg font-semibold text-gray-900 hover:text-orange-600 transition py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="flex items-center gap-2 pt-3">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {t("nav.language")}
                  </span>
                  <LangButton
                    active={lang === "en"}
                    onClick={() => setLang("en")}
                  >
                    EN
                  </LangButton>
                  <LangButton
                    active={lang === "el"}
                    onClick={() => setLang("el")}
                  >
                    EL
                  </LangButton>
                </div>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center font-semibold rounded-full py-3 shadow-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition"
                  >
                    {t("nav.book")}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

function LangButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border transition ${
        active
          ? "border-orange-500 text-orange-600 bg-orange-50"
          : "border-gray-200 text-gray-700 hover:border-orange-200"
      }`}
    >
      {children}
    </button>
  );
}
