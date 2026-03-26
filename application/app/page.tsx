import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Macnas — Bespoke Handcrafted Bags",
  description: "Studio Macnas creates bespoke handcrafted leather bags with a focus on sustainability, craftsmanship, and timeless design.",
  openGraph: {
    title: "Studio Macnas",
    description: "Bespoke handcrafted bags with purpose.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#faf9f7]">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#be7b3b] uppercase mb-4">Studio Macnas</p>
        <h1 className="text-5xl md:text-7xl font-semibold text-[#1a1714] leading-tight max-w-3xl mb-6">
          Handcrafted bags,<br />built to last.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Every bag is made by hand in our studio — designed for people who care about materials, story, and longevity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/showcase"
            className="px-6 py-3 rounded-xl bg-[#be7b3b] text-white font-medium hover:bg-[#a86330] transition-colors"
          >
            View our work
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl border border-[#e5e0d8] text-[#1a1714] font-medium hover:bg-white transition-colors"
          >
            About the studio
          </Link>
        </div>
      </section>
    </main>
  );
}
