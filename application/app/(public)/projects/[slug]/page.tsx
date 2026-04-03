import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("public_title, title, public_description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Project Not Found" };

  return {
    title: `${data.public_title || data.title} — Studio Macnas`,
    description: data.public_description || undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("v_project_public_showcase")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  // The view contains overall_sustainability_score and product_tier_label
  // but status might require a separate check or be omitted for archive showcase.
  const displayStatus = "Completed"; 

  return (
    <div className="bg-[#171717] min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        {project.hero_image_path ? (
          <Image
            src={project.hero_image_path}
            alt={project.public_title || "Project Image"}
            fill
            className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">
            👜
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent" />
        
        <div className="absolute bottom-20 left-0 w-full">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-12 bg-[#fafA00]" />
                <span className="text-[#fafA00] text-xs font-black uppercase tracking-[0.3em]">
                  Digital Product Passport
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                {project.public_title}
              </h1>
           </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Story */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="w-12 h-1 bg-[#ef5cff] mb-8" />
              <p className="text-base md:text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.public_description}
              </p>
            </div>

            {/* In-situ Images / Gallery could go here */}
          </div>

          {/* Sidebar Metadata */}
          <div className="lg:col-span-4 space-y-12">
             <div className="bg-[#000000] p-8 border border-white/5 rounded-2xl">
                <h3 className="text-[#ef5cff] text-xs font-black uppercase tracking-widest mb-8">Project Details</h3>
                
                <div className="space-y-8">
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-black">Status</span>
                    <span className="text-white font-bold">{displayStatus.toUpperCase()}</span>
                  </div>
                  
                  {project.product_tier_label && (
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-black">Collection Tier</span>
                      <span className="inline-block px-3 py-1 bg-[#fafA00] text-black text-xs font-black uppercase rounded">
                        {project.product_tier_label}
                      </span>
                    </div>
                  )}

                  {/* Sustainability Mini Chart Placeholder */}
                  {project.overall_sustainability_score !== null && project.overall_sustainability_score !== undefined && (
                    <div className="pt-8 border-t border-white/10">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Sustainability</span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-[#fafA00]">{Math.round(project.overall_sustainability_score)}</span>
                          <span className="text-gray-500 text-xs">/100</span>
                        </div>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#fafA00] transition-all duration-1000"
                          style={{ width: `${project.overall_sustainability_score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
             </div>

             <div className="p-8 border-2 border-[#fafA00] rounded-2xl">
                <h4 className="text-white font-black uppercase text-sm mb-4">Commission this style?</h4>
                <p className="text-[#a9a9a9] text-sm mb-6 leading-relaxed">
                  Every bag is a unique iteration. Interested in a custom project based on this design?
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block w-full text-center py-3 bg-[#fafA00] text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Start a conversation
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Footer Nav */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 border-t border-white/5">
        <Link href="/projects" className="text-gray-500 hover:text-[#fafA00] text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
          ← Back to Archive
        </Link>
      </section>
    </div>
  );
}

