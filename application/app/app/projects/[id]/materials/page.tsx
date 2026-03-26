import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddMaterialForm } from "@/app/app/projects/[id]/materials/add-material-form";
import { RemoveMaterialButton } from "@/app/app/projects/[id]/materials/remove-material-button";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: `Materials — ${data?.title ?? "Project"}` };
}

export default async function ProjectMaterialsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: projectMaterials }, { data: allMaterials }] = await Promise.all([
    supabase.from("projects").select("id, title").eq("id", id).single(),
    supabase
      .from("project_materials")
      .select("id, quantity_used, unit_snapshot, unit_cost_snapshot, computed_material_cost, notes, materials(name)")
      .eq("project_id", id)
      .order("created_at"),
    supabase
      .from("materials")
      .select("id, name, unit, cost_per_unit")
      .eq("is_archived", false)
      .order("name"),
  ]);

  if (!project) notFound();

  const totalCost = (projectMaterials ?? []).reduce(
    (sum, r) => sum + Number(r.computed_material_cost),
    0
  );

  const tabs = [
    { label: "Overview", href: `/app/projects/${id}` },
    { label: "Materials", href: `/app/projects/${id}/materials` },
    { label: "Time", href: `/app/projects/${id}/time` },
    { label: "Finances", href: `/app/projects/${id}/finances` },
    { label: "Publish", href: `/app/projects/${id}/publish` },
  ];

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /{" "}
          <Link href={`/app/projects/${id}`} className="hover:text-[#be7b3b]">{project.title}</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Materials</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e5e0d8]">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab.label === "Materials"
                ? "text-[#1a1714] border-[#be7b3b]"
                : "text-gray-500 hover:text-[#1a1714] border-transparent hover:border-[#be7b3b]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Total cost banner */}
      {(projectMaterials ?? []).length > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-[#e5e0d8] px-5 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total material cost</span>
          <span className="text-lg font-semibold text-[#1a1714]">{formatCurrency(totalCost)}</span>
        </div>
      )}

      {/* Materials list */}
      {(projectMaterials ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Material</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Qty</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Unit cost (snapshot)</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Notes</th>
                <th className="w-10 px-2 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projectMaterials!.map((row, i) => {
                const mat = row.materials as { name: string } | null;
                return (
                  <tr key={row.id} className={`hover:bg-[#faf9f7] transition-colors ${i < projectMaterials!.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1a1714]">{mat?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 tabular-nums">{Number(row.quantity_used).toFixed(4)} {row.unit_snapshot}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 tabular-nums">{formatCurrency(Number(row.unit_cost_snapshot))}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#1a1714] tabular-nums">{formatCurrency(Number(row.computed_material_cost))}</td>
                    <td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">{row.notes ?? "—"}</td>
                    <td className="px-2 py-3">
                      <RemoveMaterialButton id={row.id} projectId={id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add material form */}
      <AddMaterialForm projectId={id} materials={allMaterials ?? []} />
    </div>
  );
}
