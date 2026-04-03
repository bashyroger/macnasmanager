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
        <div className="absolute inset-0">
          <Image
            src={body_json.hero_image || "/images/website/bags-hero.jpg"}
            alt="Bags"
            fill
            className="object-cover opacity-90"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
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

      {/* Cherish Your Bags - Intro */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-8">
          Cherish Your Bags
        </h2>
        <p className="text-xl text-[#a9a9a9] leading-relaxed">
          Our unique handcrafted bags are more than just accessories - they are thoughtful, one-of-a-kind pieces that tell a story.
        </p>
        <p className="text-xl text-[#a9a9a9] leading-relaxed">
          Crafted from leather but also innovative, biodegradable materials like cactus leather, apple skin, and mycelium, each Macnas bag is designed to be used and cherished for years, with as goal decomposing without a trace.
        </p>
        <p className="text-xl text-[#a9a9a9] leading-relaxed">
          We invite you to join us on this journey towards a more sustainable future, where waste becomes wonder, and fashion empowers the planet.
        </p>
        <div className="pt-8">
          <Link href="/contact" className="inline-block px-12 py-5 bg-[#fafA00] text-black font-black uppercase tracking-widest hover:bg-white transition-colors">
            Get a unique bag
          </Link>
        </div>
      </section>

      {/* Legacy Gallery representation (3 columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative aspect-square bg-[#0a0a0a] rounded-sm overflow-hidden border border-white/5">
               <Image src="/cms-media/original/P6120074.jpg" alt="Gallery" fill className="object-cover" />
            </div>
            <div className="relative aspect-square bg-[#0a0a0a] rounded-sm overflow-hidden border border-white/5">
               <Image src="/cms-media/original/DSC04538.jpg" alt="Gallery" fill className="object-cover object-top" />
            </div>
            <div className="relative aspect-square bg-[#0a0a0a] rounded-sm overflow-hidden border border-white/5">
               <Image src="/cms-media/original/WhatsApp_Image_20220221_at_17.12.34_1.jpeg" alt="Gallery" fill className="object-cover" />
            </div>
         </div>
      </section>

      {/* Co-Creation Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl text-white font-black text-center tracking-tighter uppercase">
          Our co-creation process with you
        </h2>
      </section>

      {/* Process Steps List (Image Left, Text Right) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-32">
        {body_json.process_steps?.map((step: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="relative aspect-[4/3] w-[80%] mx-auto md:w-full bg-[#111] overflow-hidden rounded border border-white/5">
                <Image
                  src={step.image_path}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
             </div>
             <div className="space-y-4 text-center md:text-left">
               <h2 className="text-4xl text-white font-black tracking-tighter uppercase">{step.title}</h2>
               <p className="text-lg text-[#a9a9a9] leading-relaxed max-w-md mx-auto md:mx-0">
                 {step.text}
               </p>
             </div>
          </div>
        ))}
      </section>

      {/* Outro & Pricing */}
      <section className="py-32 text-center space-y-8 bg-[#000] border-y border-white/5">
        <h1 className="text-4xl text-white font-black tracking-tighter uppercase">Would you like a bag?</h1>
        <p className="text-[#a9a9a9] text-xl leading-relaxed max-w-2xl mx-auto">
          For both individuals and businesses, our prices are available upon request.<br/>
          Range from <strong className="text-white">{body_json.pricing_range}</strong>
        </p>
        <div className="pt-4">
           <Link href="/contact" className="inline-block px-12 py-5 bg-[#fafA00] text-black font-black uppercase tracking-widest hover:bg-white transition-colors">
              Contact us for more info
           </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#171717] p-8 border border-white/5 flex flex-col justify-between hover:bg-[#1a1a1a] transition-colors">
               <p className="text-[#a9a9a9] text-lg leading-relaxed mb-12">"Sparkling, creative, artisanal. Those three words summarize professional Belinda. The process of designing a bag together what a party, and the result is fantastic. I love my Macnas bag."</p>
               <span className="text-[#fafA00] font-black tracking-widest uppercase text-sm">— Evelyn</span>
            </div>
            <div className="bg-[#171717] p-8 border border-white/5 flex flex-col justify-between hover:bg-[#1a1a1a] transition-colors">
               <p className="text-[#a9a9a9] text-lg leading-relaxed mb-12">"I thought it was very special to be included in the creative process and to learn everything about the sustainable materials and the origin. Very happy with the end product and the nice collaboration."</p>
               <span className="text-[#fafA00] font-black tracking-widest uppercase text-sm">— Nicole</span>
            </div>
            <div className="bg-[#171717] p-8 border border-white/5 flex flex-col justify-between hover:bg-[#1a1a1a] transition-colors">
               <p className="text-[#a9a9a9] text-lg leading-relaxed mb-12">"Thank you for this beautiful & sustainable design."</p>
               <span className="text-[#fafA00] font-black tracking-widest uppercase text-sm">— Partij voor de Dieren</span>
            </div>
         </div>
      </section>
    </div>
  );
}
