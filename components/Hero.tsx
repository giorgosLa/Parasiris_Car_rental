"use client";

import Image from "next/image";
import { useTranslation } from "./LanguageProvider";

export default function Hero() {
  const t = useTranslation();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="Car driving background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/40" />
        <div className="absolute -bottom-40 -left-32 w-[480px] h-[480px] bg-orange-500/30 blur-3xl rounded-full" />
        <div className="absolute -top-40 -right-32 w-[420px] h-[420px] bg-blue-500/20 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="max-w-4xl px-6 space-y-6">
        <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold tracking-wide backdrop-blur-sm border border-white/20">
          {t("hero.badge")}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
}
