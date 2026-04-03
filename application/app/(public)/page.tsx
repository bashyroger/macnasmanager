import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function PublicHomePage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", "home")
    .single();

  if (!page) return notFound();

  const body_json = page.body_json as any;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={body_json.hero_image || "/images/website/home-hero.jpg"}
            alt="Hero background"
            fill
            className="object-cover object-center opacity-90"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-[6rem] font-black tracking-tighter text-white mb-6 leading-tight uppercase drop-shadow-lg">
              {body_json.hero_title}
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow">
              {body_json.hero_subtitle}
            </p>
          </div>
        </div>

        {/* Brand Slogan */}
        <div className="absolute bottom-12 right-8 hidden lg:block">
           <span className="text-[#ef5cff] text-2xl font-medium italic tracking-tight">
             Rethinking fashion patterns
           </span>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-[#000000] py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-1 bg-[#ef5cff] mx-auto mb-12" />
          <h2 className="text-2xl md:text-4xl font-medium text-white leading-tight mb-8 max-w-4xl mx-auto">
            {body_json.intro_text}
          </h2>
          <Link href="/materials" className="text-[#fafA00] uppercase tracking-widest text-xs font-black hover:underline">
            Discover our materials
          </Link>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="bg-[#171717] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {body_json.sections?.map((section: any, idx: number) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative h-[400px] mb-6 overflow-hidden bg-black">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform opacity-70"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 border-[10px] border-transparent group-hover:border-[#ef5cff]/20 transition-all" />
                </div>
                <h3 className="text-[#fafA00] text-xl font-black uppercase tracking-tighter mb-2">{section.title}</h3>
                <p className="text-[#a9a9a9] text-sm leading-relaxed mb-4">{section.text}</p>
                <Link href={section.link} className="inline-flex items-center gap-1 text-white text-xs font-bold uppercase tracking-wider hover:text-[#fafA00]">
                  Read more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
