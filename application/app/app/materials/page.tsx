import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Materials Library" };

export default async function MaterialsPage() {
  const supabase = await createClient();
  const { data: materials } = await supabase
    .from("materials")
    .select("id, name, unit, cost_per_unit, supplier_name, is_archived")
    .eq("is_archived", false)
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1714]">Materials Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">{materials?.length ?? 0} materials</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/app/materials/import"
            className="px-4 py-2 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#faf9f7] transition-colors"
          >
            Import CSV
          </Link>
          <Link
            href="/app/materials/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New material
          </Link>
        </div>
      </div>

      {!materials || materials.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">No materials yet</p>
          <p className="text-sm">Add materials or import from CSV to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Unit</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Cost/unit</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Supplier</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material, i) => (
                <tr
                  key={material.id}
                  className={`hover:bg-[#faf9f7] transition-colors ${i < materials.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/app/materials/${material.id}`} className="font-medium text-[#1a1714] hover:text-[#be7b3b] transition-colors">
                      {material.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">{material.unit}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1714] font-medium">{formatCurrency(material.cost_per_unit)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-400">{material.supplier_name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/app/materials/${material.id}`}>
                      <ChevronRight className="w-4 h-4 text-gray-300 hover:text-gray-500" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
