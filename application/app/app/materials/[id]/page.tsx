import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MaterialForm } from "../material-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [mResult, aResult, sResult] = await Promise.all([
    supabase.from("materials").select("*").eq("id", id).single(),
    supabase.from("sustainability_axes").select("*").eq("is_active", true).order("name"),
    supabase.from("material_sustainability_scores").select("*").eq("material_id", id),
  ]);

  const material = mResult.data;
  const activeAxes = aResult.data ?? [];
  const scores = sResult.data ?? [];

  if (!material) notFound();

  // Map scores to a record for the form
  const initialScores: Record<string, number> = {};
  scores.forEach((s) => {
    initialScores[s.sustainability_axis_id] = s.score;
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link 
          href="/app/materials" 
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#be7b3b] transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to library
        </Link>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Edit Material</h1>
        <p className="text-sm text-gray-500 mt-0.5">{material.name}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d8] p-8 shadow-sm">
        <MaterialForm 
          materialId={id}
          activeAxes={activeAxes as any[]}
          initialScores={initialScores}
          defaultValues={{
            name: material.name,
            unit: material.unit,
            cost_per_unit: material.cost_per_unit,
            supplier_name: material.supplier_name ?? undefined,
            supplier_url: material.supplier_url ?? undefined,
            stock_level: material.stock_level ?? undefined,
            origin_story: material.origin_story ?? undefined,
            production_method: material.production_method ?? undefined,
            end_of_life: material.end_of_life ?? undefined,
            carbon_footprint: material.carbon_footprint ?? undefined,
            biodegradability: material.biodegradability ?? undefined,
            compostability: material.compostability ?? undefined,
            color_options: material.color_options ?? undefined,
            availability_notes: material.availability_notes ?? undefined,
            strength_rating: material.strength_rating ?? undefined,
            durability_rating: material.durability_rating ?? undefined,
            bendability_rating: material.bendability_rating ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
