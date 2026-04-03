import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
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
    <div className="bg-[#171717] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
           <div className="max-w-3xl">
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                {page.title}
              </h1>
              <span className="text-[#ef5cff] text-2xl font-medium italic">Inspire & Educate</span>
           </div>
           {body_json.hero_image && (
             <div className="w-full md:w-96 aspect-square border-2 border-[#fafA00] relative rotate-3 hover:rotate-0 transition-transform">
               <Image 
                src={body_json.hero_image} 
                alt="Event hero" 
                fill                 className="object-cover" 
                 sizes="(max-width: 768px) 100vw, 400px"
                />
             </div>
           )}
        </header>

        <div className="space-y-12">
          {body_json.upcoming_events?.map((ev: any, idx: number) => (
            <div key={idx} className="bg-[#000000] border border-white/5 p-8 flex flex-col md:flex-row gap-12 items-center hover:border-[#fafA00] transition-colors">
               <div className="flex flex-col items-center justify-center p-6 bg-[#fafA00] text-black w-32 h-32 flex-shrink-0 font-black text-center">
                  <span className="text-xs uppercase tracking-widest">{ev.date.split(' ')[1]}</span>
                  <span className="text-3xl">{ev.date.split(' ')[0]}</span>
               </div>
               <div className="flex-1 space-y-4">
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter">{ev.title}</h3>
                  <p className="text-[#a9a9a9] text-lg leading-relaxed">{ev.description}</p>
                  <div className="flex gap-6 text-xs font-bold text-white uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-[#ef5cff]"><Calendar className="w-4 h-4" /> RSVP OPEN</span>
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> UTRECHT</span>
                  </div>
               </div>
               <button className="px-8 py-3 border border-white text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">
                 Learn More
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
