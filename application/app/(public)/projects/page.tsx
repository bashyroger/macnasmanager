import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Studio Macnas",
  description: "Explore our archive of unique, sustainable handcrafted bag projects.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  // We'll use the public view if it exists, or raw projects table
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("publish_enabled", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-[#171717] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 uppercase">
            Project <span className="text-[#fafA00]">Archive</span>
          </h1>
          <p className="text-[#a9a9a9] text-lg max-w-2xl leading-relaxed">
            Each project is a chapter in our journey toward sustainable creation. 
            Documenting the story, materials, and impact behind every piece we craft.
          </p>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="py-20 border-t border-white/10">
            <p className="text-[#a9a9a9]">No projects found in the archive yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.slug}`}
                className="group flex flex-col"
              >
                <div className="relative h-[450px] mb-6 overflow-hidden bg-black border border-white/5">
                  {project.hero_image_path ? (
                    <Image
                      src={project.hero_image_path}
                      alt={project.public_title || project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl grayscale opacity-20">
                      👜
                    </div>
                  )}
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#fafA00] translate-x-12 -translate-y-12 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform" />
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[2px] w-8 bg-[#ef5cff]" />
                  <span className="text-[#ef5cff] text-[10px] font-black uppercase tracking-[0.2em]">
                    {project.status}
                  </span>
                </div>

                <h3 className="text-white text-2xl font-black uppercase tracking-tighter group-hover:text-[#fafA00] transition-colors mb-2">
                  {project.public_title || project.title}
                </h3>
                
                <p className="text-[#a9a9a9] text-sm leading-relaxed line-clamp-3 mb-6">
                  {project.public_description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                   <span className="text-white text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                     View Passport →
                   </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
