import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase — Studio Macnas",
  description: "Browse completed handcrafted bag projects from Studio Macnas.",
};

export default async function ShowcasePage() {
  const supabase = await createClient();
  const response = await supabase
    .from("v_project_public_showcase")
    .select("*")
    .order("published_at", { ascending: false });
  const projects = response.data as any[] | null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16" aria-labelledby="showcase-title">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#be7b3b] uppercase mb-3">Our Work</p>
        <h1 id="showcase-title" className="text-4xl font-semibold text-[#1a1714] mb-4">Project Showcase</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Each piece is a digital product passport — documenting the story, materials, and sustainability profile of every bag we make.
        </p>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No published projects yet</p>
          <p className="text-sm mt-2">Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/showcase/${project.slug}`}
              className="group bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#be7b3b] focus:ring-offset-2"
              aria-label={`View details for ${project.public_title}`}
            >
              {/* Hero image placeholder */}
              <div className="aspect-[4/3] bg-[#f0ebe4] flex items-center justify-center relative">
                {project.hero_image_path ? (
                  <Image
                    src={`https://fsbpxifvpjtkrltfizmv.supabase.co/storage/v1/object/public/project-public/${project.hero_image_path}`}
                    alt={project.public_title ?? "Project Hero Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="text-4xl" aria-hidden="true">👜</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-[#1a1714] group-hover:text-[#be7b3b] transition-colors">
                    {project.public_title}
                  </h2>
                  {project.product_tier_label && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium flex-shrink-0">
                      {project.product_tier_label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{project.public_description}</p>
                {project.overall_sustainability_score && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-[#f0ebe4] rounded-full h-1.5">
                      <div
                        className="bg-[#be7b3b] h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, project.overall_sustainability_score)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums">
                      {Math.round(project.overall_sustainability_score)}/100
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
