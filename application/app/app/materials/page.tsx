import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MaterialList } from "./material-list";
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
        <MaterialList materials={materials as any[]} />
      )}
    </div>
  );
}
