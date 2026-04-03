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
    <div className="bg-[#171717] min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center bg-[#000000] mb-24">
        <div className="absolute inset-0">
          {body_json.hero_image && (
            <Image
              src={body_json.hero_image}
              alt="Materials"
              fill
              className="object-cover object-center opacity-90"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24">
           <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase mb-2">
                {body_json.hero_title}
              </h2>
              <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter text-white uppercase mb-6 leading-[0.9]">
                {body_json.hero_subtitle || "FINDING THE PERFECT MATERIAL"}
              </h1>
              <p className="text-lg text-white font-medium mb-10 leading-relaxed max-w-xl drop-shadow">
                {body_json.description?.split('\n')[0]} {/* First paragraph to match original concise look */}
              </p>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Render rest of the description that was cut off above, if it's long */}
        <div className="text-[#a9a9a9] text-xl leading-relaxed whitespace-pre-wrap max-w-4xl mx-auto mb-20 text-center">
            {body_json.description?.split('\n').slice(1).join('\n')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {body_json.materials?.map((mat: any, idx: number) => (
            <div key={idx} className="bg-[#000000] border border-white/5 rounded-2xl overflow-hidden group">
               <div className="relative h-64 overflow-hidden">
                  <Image
                    src={mat.image_path || mat.image || "/images/website/material-cactus.jpg"}
                    alt={mat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-[#ef5cff] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest z-10">
                    Sustainable
                  </div>
               </div>
               <div className="p-8">
                  <h3 className="text-[#fafA00] text-xl font-black uppercase tracking-tighter mb-4">{mat.name}</h3>
                  <p className="text-[#a9a9a9] text-base leading-relaxed whitespace-pre-wrap">{mat.text}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
