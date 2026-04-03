import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", "events")
    .single();

  if (!page) return notFound();

  const body_json = page.body_json as any;

  return (
    <div className="bg-[#171717] min-h-screen">
      {/* Dynamic Hero to match legacy Materials/Events style */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center pt-24 overflow-hidden border-b border-white/10">
        {body_json.hero_image && (
          <>
            <Image
              src={body_json.hero_image}
              alt={body_json.title || "Events"}
              fill
              className="object-cover object-center"
              priority
            />
            {/* Gradient overlay to smoothly blend image into the dark page background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/80 to-transparent" />
          </>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto mb-24 md:mt-0 md:mb-0">
          <div className="max-w-2xl">
            <h2 className="text-xl md:text-2xl font-black text-[#fafA00] tracking-widest uppercase mb-4 opacity-90">
              Inspire
            </h2>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-[1.1]">
              {body_json.title || "Spread the love (and knowledge)"}
            </h1>
            <p className="text-[#a9a9a9] text-xl leading-relaxed max-w-xl">
              To make a big impact on the fashion industry, Studio Macnas shares their innovative and new-found knowledge in workshops, seminars and events.
            </p>
          </div>
        </div>
      </section>

      {/* Events Title Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h2 className="text-4xl text-white font-black text-center tracking-tighter uppercase">
          Events
        </h2>
      </section>

      {/* 3-Column Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {body_json.upcoming_events?.map((ev: any, idx: number) => (
             <div key={idx} className="flex flex-col group">
                <div className="relative aspect-[4/3] w-full mb-6 rounded-sm overflow-hidden bg-[#111] border border-white/5">
                   <Image 
                     src={ev.image_path} 
                     alt={ev.title} 
                     fill 
                     className="object-cover transition-transform duration-500 group-hover:scale-105" 
                   />
                </div>
                <h3 className="text-2xl text-white font-black tracking-tighter uppercase mb-2 group-hover:text-[#fafA00] transition-colors">{ev.title}</h3>
                <p className="text-[#a9a9a9] text-sm uppercase tracking-widest font-bold mb-4">{ev.date}</p>
                <p className="text-[#a9a9a9] text-base leading-relaxed mb-6">{ev.description}</p>
                {ev.link_url && (
                   <a href={ev.link_url} target="_blank" rel="noopener noreferrer" className="mt-auto block text-white uppercase text-xs tracking-widest font-black underline decoration-[#fafA00] underline-offset-4 decoration-2 hover:text-[#fafA00] transition-colors">
                      Learn More
                   </a>
                )}
             </div>
          ))}
        </div>
      </section>

      {/* Services Breakdowns (Alternating Blocks) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 space-y-32">
        {/* Expos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="space-y-6 text-center md:text-left order-2 md:order-1">
             <h2 className="text-4xl text-white font-black tracking-tighter uppercase">Expo's</h2>
             <p className="text-lg text-[#a9a9a9] leading-relaxed max-w-md mx-auto md:mx-0">
               Sharing the latest innovations to inspire visitors into changing fashion patterns.
             </p>
             <div className="pt-4">
                <Link href="/contact" className="inline-block px-10 py-4 border border-[#fafA00] text-[#fafA00] font-black uppercase tracking-widest hover:bg-[#fafA00] hover:text-black transition-colors">
                  Book us
                </Link>
             </div>
           </div>
           <div className="relative aspect-[4/3] w-[80%] md:w-full mx-auto md:mx-0 bg-[#111] overflow-hidden rounded border border-white/5 order-1 md:order-2">
              <Image src="/cms-media/original/Materialexplorer.jpg" alt="Expo" fill className="object-cover" />
           </div>
        </div>

        {/* Workshops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="relative aspect-[4/3] w-[80%] md:w-full mx-auto md:mx-0 bg-[#111] overflow-hidden rounded border border-white/5">
              <Image src="/cms-media/original/course.png" alt="Workshop" fill className="object-cover" />
           </div>
           <div className="space-y-6 text-center md:text-left">
             <h2 className="text-4xl text-white font-black tracking-tighter uppercase">Workshops</h2>
             <p className="text-lg text-[#a9a9a9] leading-relaxed max-w-md mx-auto md:mx-0">
               Join us in the Macnas studio for a bag-making course! As a birthday party, team building activity or to learn to make your own dream bag in multiple sessions.
             </p>
             <p className="text-lg text-[#a9a9a9] leading-relaxed max-w-md mx-auto md:mx-0">
               Contact us for available options and pricing.
             </p>
             <div className="pt-4">
                <Link href="/contact" className="inline-block px-10 py-4 border border-[#fafA00] text-[#fafA00] font-black uppercase tracking-widest hover:bg-[#fafA00] hover:text-black transition-colors">
                  Let me know more
                </Link>
             </div>
           </div>
        </div>

        {/* Seminars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="space-y-6 text-center md:text-left order-2 md:order-1">
             <h2 className="text-4xl text-white font-black tracking-tighter uppercase">Seminars</h2>
             <p className="text-lg text-[#a9a9a9] leading-relaxed max-w-md mx-auto md:mx-0">
               Sharing is caring! Would you like to inform your students about creative entrepreneurship as a maker or the latest material innovations? We love sharing the nitty gritty details with students, fellow makers or companies. 
             </p>
             <div className="pt-4">
                <Link href="/contact" className="inline-block px-10 py-4 border border-[#fafA00] text-[#fafA00] font-black uppercase tracking-widest hover:bg-[#fafA00] hover:text-black transition-colors">
                  Let us inspire you
                </Link>
             </div>
           </div>
           <div className="relative aspect-[4/3] w-[80%] md:w-full mx-auto md:mx-0 bg-[#111] overflow-hidden rounded border border-white/5 order-1 md:order-2">
              <Image src="/cms-media/original/ac596e7600fd4d62821d83e3df2f4e3e(1).jpg" alt="Seminar" fill className="object-cover" />
           </div>
        </div>
      </section>

      {/* Outro - Need Fashion Inspiration? */}
      <section className="py-32 text-center space-y-8 bg-[#000] border-t border-white/5">
        <h1 className="text-3xl md:text-4xl text-white font-black tracking-tighter uppercase">Need fashion inspiration?</h1>
        <p className="text-[#a9a9a9] text-xl leading-relaxed max-w-2xl mx-auto">
          Drop me a line! Together we can change the patterns of the fashion world.
        </p>
        <div className="pt-8">
           <Link href="/contact" className="inline-block px-12 py-5 bg-[#fafA00] text-black font-black uppercase tracking-widest hover:bg-white transition-colors">
              Get in touch
           </Link>
        </div>
      </section>
    </div>
  );
}
