"use client";

import Image from "next/image";
import { useTranslation } from "./LanguageProvider";

export default function Hero() {
  const t = useTranslation();

  return (
    <section className="relative w-full min-h-[100vh] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background image wrapper */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="Car driving background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Intro Text */}
      <div className="max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-md">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
}
