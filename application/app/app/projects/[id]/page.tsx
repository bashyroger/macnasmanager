import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

const statusColors: Record<string, string> = {
  inquiry: "bg-gray-100 text-gray-600",
  consultation: "bg-blue-100 text-blue-700",
  design: "bg-purple-100 text-purple-700",
  production: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  delivered: "bg-teal-100 text-teal-700",
  archived: "bg-gray-100 text-gray-400",
};

const tabs = [
  { label: "Overview", href: "" },
  { label: "Materials", href: "/materials" },
  { label: "Time", href: "/time" },
  { label: "Finances", href: "/finances" },
  { label: "Publish", href: "/publish" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: data?.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: materialTotal }, { data: timeTotal }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, clients(id, full_name)")
      .eq("id", id)
      .single(),
    supabase
      .from("project_materials")
      .select("computed_material_cost")
      .eq("project_id", id),
    supabase
      .from("time_entries")
      .select("duration_minutes")
      .eq("project_id", id),
  ]);

  if (!project) notFound();

  const materialCost = (materialTotal ?? []).reduce((sum, r) => sum + Number(r.computed_material_cost), 0);
  const totalMinutes = (timeTotal ?? []).reduce((sum, r) => sum + r.duration_minutes, 0);
  const laborCost = project.hourly_rate_snapshot
    ? Math.round((totalMinutes / 60) * Number(project.hourly_rate_snapshot) * 100) / 100
    : null;
  const client = project.clients as { id: string; full_name: string } | null;

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb + header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">
            <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#1a1714]">{project.title}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[project.status] ?? "bg-gray-100 text-gray-500"}`}>
              {project.status}
            </span>
          </div>
          {client && (
            <Link href={`/app/clients/${client.id}`} className="text-sm text-gray-400 hover:text-[#be7b3b] mt-1 inline-block">
              {client.full_name}
            </Link>
          )}
        </div>
        <Link
          href={`/app/projects/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#faf9f7] transition-colors"
        >
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Materials", value: formatCurrency(materialCost) },
          { label: "Labor", value: laborCost !== null ? formatCurrency(laborCost) : "—" },
          { label: "Time logged", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` },
          { label: "Billed", value: formatCurrency(project.charged_amount) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e5e0d8] p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-lg font-semibold text-[#1a1714]">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e5e0d8]">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={`/app/projects/${id}${tab.href}`}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#1a1714] border-b-2 border-transparent hover:border-[#be7b3b] transition-colors -mb-px"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Overview content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#e5e0d8] divide-y divide-[#e5e0d8]">
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1a1714]">Project details</h2>
          </div>
          {[
            { label: "Short code", value: project.short_code },
            { label: "Start date", value: formatDate(project.start_date) },
            { label: "Target delivery", value: formatDate(project.target_delivery_date) },
            { label: "Completed", value: project.completed_at ? formatDate(project.completed_at) : "—" },
            { label: "Hourly rate", value: project.hourly_rate_snapshot ? formatCurrency(Number(project.hourly_rate_snapshot)) : "—" },
            { label: "Overhead", value: formatCurrency(Number(project.overhead_amount)) },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3 flex gap-4">
              <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-sm text-[#1a1714]">{value ?? "—"}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#e5e0d8] divide-y divide-[#e5e0d8]">
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1a1714]">Private notes</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-[#1a1714] whitespace-pre-wrap">{project.private_notes || "No internal notes."}</p>
          </div>
          {project.publish_enabled && (
            <div className="px-5 py-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Published
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
