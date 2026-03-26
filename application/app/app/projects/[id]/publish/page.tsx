import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { PublishToggle } from "./publish-toggle";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const res = await supabase.from("projects").select("title").eq("id", id).single();
  const data = res.data as any;
  return { title: `Publish — ${data?.title ?? "Project"}` };
}

export default async function ProjectPublishPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const pResult = await supabase.from("projects").select("*").eq("id", id).single();
  const project = pResult.data as any;
  if (!project) notFound();

  const tabs = [
    { label: "Overview", href: `/app/projects/${id}` },
    { label: "Materials", href: `/app/projects/${id}/materials` },
    { label: "Time", href: `/app/projects/${id}/time` },
    { label: "Finances", href: `/app/projects/${id}/finances` },
    { label: "Publish", href: `/app/projects/${id}/publish` },
  ];

  // Readiness Checks
  const hasValidStatus = ["completed", "delivered"].includes(project.status);
  const hasSlug = !!project.slug?.trim();
  const hasPublicTitle = !!project.public_title?.trim();
  const hasPublicDescription = !!project.public_description?.trim();
  const hasHeroImage = !!project.hero_image_path?.trim();

  const isReady = hasValidStatus && hasSlug && hasPublicTitle && hasPublicDescription && hasHeroImage;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /{" "}
          <Link href={`/app/projects/${id}`} className="hover:text-[#be7b3b]">{project.title}</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Publish Settings</h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[#e5e0d8]">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab.label === "Publish"
                ? "text-[#1a1714] border-[#be7b3b]"
                : "text-gray-500 hover:text-[#1a1714] border-transparent hover:border-[#be7b3b]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Readiness Checklist */}
        <section className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e5e0d8] bg-[#faf9f7] flex justify-between items-center">
            <h2 className="text-sm font-semibold text-[#1a1714]">Readiness Checklist</h2>
            {isReady ? (
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full ring-1 ring-inset ring-green-600/20">Ready</span>
            ) : (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-inset ring-amber-600/20">Action required</span>
            )}
          </div>
          <div className="divide-y divide-[#e5e0d8]">
            <CheckItem label="Project is marked 'completed' or 'delivered'" isMet={hasValidStatus} />
            <CheckItem label="Custom slug is defined" isMet={hasSlug} />
            <CheckItem label="Public title is defined" isMet={hasPublicTitle} />
            <CheckItem label="Public description is defined" isMet={hasPublicDescription} />
            <CheckItem label="Hero image path is valid" isMet={hasHeroImage} />
          </div>
          {!isReady && (
            <div className="px-5 py-4 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-800">Please provide all missing information in the <Link href={`/app/projects/${id}/edit`} className="underline font-medium hover:text-amber-900">Project settings</Link> before publishing.</p>
            </div>
          )}
        </section>

        {/* Publish Action */}
        <section className="bg-white rounded-xl border border-[#e5e0d8] p-6">
          <h2 className="text-lg font-semibold text-[#1a1714] mb-2">Visibility Settings</h2>
          <p className="text-sm text-gray-500 mb-6">Manage the public status of the Digital Product Passport. A published passport can be shared with clients and viewed on the showcase.</p>
          
          <PublishToggle projectId={project.id} isPublished={project.publish_enabled} isReady={isReady} />

          {project.publish_enabled && (
            <div className="mt-6 pt-6 border-t border-[#e5e0d8]">
              <h3 className="text-sm font-medium text-[#1a1714] mb-3">Live URLs</h3>
              <a 
                href={`/showcase/${project.slug}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#faf9f7] transition-colors group"
              >
                <span>/showcase/{project.slug}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#be7b3b]" />
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function CheckItem({ label, isMet }: { label: string; isMet: boolean }) {
  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <span className="text-sm text-[#1a1714]">{label}</span>
      {isMet ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-300" />
      )}
    </div>
  );
}
