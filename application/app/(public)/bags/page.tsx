import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function BagsPage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", "bags")
    .single();

  if (!page) return notFound();

  const body_json = page.body_json as any;

  return (
    <div className="bg-[#171717] min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center bg-[#000000]">
        <div className="absolute inset-0 grayscale opacity-30">
          <Image
            src={body_json.hero_image || "/images/website/bags-hero.jpg"}
            alt="Bags"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-3xl">
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                {body_json.hero_title}
              </h1>
              <p className="text-xl text-[#a9a9a9] max-w-xl">
                {body_json.description}
              </p>
           </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <h2 className="text-[#fafA00] text-3xl font-black uppercase tracking-tighter">Our Method</h2>
            <div className="space-y-8">
              {body_json.process_steps?.map((step: any, idx: number) => (
                <div key={idx} className="flex gap-6 group">
                  <span className="text-4xl font-black text-[#ef5cff]/20 flex-shrink-0 group-hover:text-[#ef5cff] transition-colors">{idx + 1}</span>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">{step.title}</h4>
                    <p className="text-[#a9a9a9] text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 border-2 border-[#fafA00] rounded-2xl bg-[#000000]">
             <h3 className="text-[#fafA00] font-black uppercase mb-6">Pricing & Materials</h3>
             <p className="text-[#a9a9a9] mb-8 leading-relaxed">
               Custom bags usually range between <strong className="text-white">{body_json.pricing_range}</strong> depending on materials chosen and complexity.
             </p>
             <div className="space-y-6">
                <p className="text-white font-bold text-sm italic">"Studio Macnas co-creates with you. We don’t just sell a bag; we build a companion for life."</p>
                <Link href="/contact" className="inline-block w-full text-center py-4 bg-[#fafA00] text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-colors">
                  Start a Co-Creation
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
