import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const response = await supabase
    .from("v_project_public_showcase")
    .select("public_title, public_description")
    .eq("slug", slug)
    .single();
  const data = response.data as any | null;

  if (!data) return { title: "Project Not Found" };

  return {
    title: `${data.public_title} — Studio Macnas`,
    description: data.public_description ?? undefined,
    openGraph: {
      title: data.public_title ?? "Studio Macnas Project",
      description: data.public_description ?? undefined,
      type: "website",
    },
  };
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const response = await supabase
    .from("v_project_public_showcase")
    .select("*")
    .eq("slug", slug)
    .single();
  const project = response.data as any | null;

  if (!project) notFound();

  const radarData = project.radar_chart_payload as Array<{
    axis: string;
    score: number;
    letter_grade: string;
  }> | null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16" aria-labelledby="project-title">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#be7b3b]">Studio Macnas</Link>
        {" / "}
        <Link href="/showcase" className="hover:text-[#be7b3b]">Showcase</Link>
        {" / "}
        <span className="text-[#1a1714]" aria-current="page">{project.public_title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10 relative aspect-[16/9] bg-[#f0ebe4] rounded-2xl overflow-hidden">
        {project.hero_image_path ? (
          <Image
            src={`https://fsbpxifvpjtkrltfizmv.supabase.co/storage/v1/object/public/project-public/${project.hero_image_path}`}
            alt={project.public_title ?? "Project Hero Image"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl" aria-hidden="true">
            👜
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 id="project-title" className="text-3xl font-semibold text-[#1a1714] mb-3">{project.public_title}</h1>
          <p className="text-gray-500 text-lg leading-relaxed">{project.public_description}</p>
        </div>
        {project.product_tier_label && (
          <div className="flex-shrink-0 text-center">
            <span className="block text-xs text-gray-400 mb-1">Product Tier</span>
            <span className="text-sm px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold">
              {project.product_tier_label}
            </span>
          </div>
        )}
      </div>

      {/* Sustainability section */}
      {radarData && radarData.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e5e0d8] p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[#1a1714]">Sustainability Profile</h2>
            {project.overall_sustainability_score && (
              <div className="text-right">
                <span className="text-2xl font-bold text-[#be7b3b]">
                  {Math.round(project.overall_sustainability_score)}
                </span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {radarData.map((axis) => (
              <div key={axis.axis} className="flex items-center gap-4">
                <div className="w-32 flex-shrink-0">
                  <span className="text-sm text-gray-600">{axis.axis}</span>
                </div>
                <div className="flex-1 bg-[#f0ebe4] rounded-full h-2">
                  <div
                    className="bg-[#be7b3b] h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, axis.score)}%` }}
                  />
                </div>
                <span className="w-8 text-sm font-bold text-[#1a1714] text-right">
                  {axis.letter_grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-8 border-t border-[#e5e0d8]">
        <Link href="/showcase" className="text-sm text-gray-400 hover:text-[#be7b3b] transition-colors">
          ← Back to showcase
        </Link>
        <Link href="/contact" className="text-sm text-[#be7b3b] font-medium hover:underline">
          Enquire about a commission
        </Link>
      </div>
    </main>
  );
}
