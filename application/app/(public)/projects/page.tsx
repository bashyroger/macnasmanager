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
    .order("target_delivery_date", { ascending: false });

  return (
    <div className="bg-[#171717] min-h-screen">
      {/* Dynamic Hero to match legacy Materials/Events style */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center pt-24 overflow-hidden border-b border-white/10">
        <Image
          src="/cms-media/original/Studio-Macnas-WNDRLST-site-27JPG.jpg"
          alt="Projects Archive"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient overlay matching legacy */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto mb-24 md:mt-0 md:mb-0">
          <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
              Projects
            </h1>
            <p className="text-[#a9a9a9] text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
              Our focus is not only on creating sustainable bags, but also on creating sustainable relations with our clients.<br /><br />
              From material selection to design thinking, this is how we approached our clients requests.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {!projects || projects.length === 0 ? (
          <div className="py-20 border-t border-white/10">
            <p className="text-[#a9a9a9]">No projects found in the archive yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
            {projects.map((project) => (
             <div key={project.id} className="flex flex-col group">
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="relative aspect-[4/3] w-full mb-6 bg-[#111] overflow-hidden rounded-sm border border-white/5">
                    {project.hero_image_path ? (
                      <Image
                        src={project.hero_image_path}
                        alt={project.public_title || project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl grayscale opacity-20">
                        👜
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl text-white font-bold uppercase tracking-widest mb-4">{project.public_title || project.title}</h2>
                  <p className="text-[#a9a9a9] text-base leading-relaxed line-clamp-4">
                    {project.public_description}
                  </p>
                </Link>
             </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
