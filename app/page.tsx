export const dynamic = "force-dynamic";
export const revalidate = 0;

import Fleet from "@/components/Fleet";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <SearchBar />
      <Fleet />
      <FAQ />
    </div>
  );
}
