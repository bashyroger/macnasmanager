import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function MaterialsPage() {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", "materials")
    .single();

  if (!page) return notFound();

  const body_json = page.body_json as any;

  return (
    <div className="bg-[#171717] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-24">
           <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6">
             {body_json.hero_title}
           </h1>
           <p className="text-[#a9a9a9] text-xl max-w-2xl leading-relaxed">
             {body_json.description}
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {body_json.materials?.map((mat: any, idx: number) => (
            <div key={idx} className="bg-[#000000] border border-white/5 rounded-2xl overflow-hidden group">
               <div className="relative h-64 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <Image
                    src={mat.image || "/images/website/material-cactus.jpg"}
                    alt={mat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-[#ef5cff] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    Sustainable
                  </div>
               </div>
               <div className="p-8">
                  <h3 className="text-[#fafA00] text-xl font-black uppercase tracking-tighter mb-4">{mat.name}</h3>
                  <p className="text-[#a9a9a9] text-sm leading-relaxed italic">{mat.text}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
