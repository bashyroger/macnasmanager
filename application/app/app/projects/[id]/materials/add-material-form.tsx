"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Material = {
  id: string;
  name: string;
  unit: string;
  cost_per_unit: number;
};

export function AddMaterialForm({
  projectId,
  materials,
}: {
  projectId: string;
  materials: Material[];
}) {
  const router = useRouter();
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = materials.find((m) => m.id === materialId);
  const qty = parseFloat(quantity);
  const computedCost =
    selected && !isNaN(qty) && qty > 0
      ? Math.round(qty * selected.cost_per_unit * 100) / 100
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || isNaN(qty) || qty <= 0) {
      setError("Please select a material and enter a valid quantity.");
      return;
    }

    setError(null);
    setSubmitting(true);
    const supabase = createClient();

    const { error: dbError } = await supabase.from("project_materials").insert({
      project_id: projectId,
      material_id: selected.id,
      quantity_used: qty,
      unit_snapshot: selected.unit,
      unit_cost_snapshot: selected.cost_per_unit,
      computed_material_cost: Math.round(qty * selected.cost_per_unit * 100) / 100,
      notes: notes.trim() || null,
    });

    setSubmitting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }

    router.refresh();
    setMaterialId("");
    setQuantity("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e5e0d8] p-5 space-y-4">
      <h2 className="text-sm font-semibold text-[#1a1714]">Add material</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Material</label>
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            className={inputClass(!materialId && !!error)}
          >
            <option value="">Select a material…</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.unit}) — €{Number(m.cost_per_unit).toFixed(4)}/{m.unit}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Quantity {selected ? `(${selected.unit})` : ""}
          </label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass(!quantity && !!error)}
            placeholder="0"
          />
        </div>
      </div>

      {computedCost !== null && (
        <div className="text-sm text-[#1a1714] bg-[#faf9f7] rounded-lg px-4 py-2.5 flex justify-between">
          <span className="text-gray-500">Computed cost</span>
          <span className="font-semibold">€{computedCost.toFixed(2)}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes (optional)</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass(false)}
          placeholder="e.g. offcuts included"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
      >
        {submitting ? "Adding…" : "Add to project"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] ${
    hasError ? "border-red-300 bg-red-50" : "border-[#e5e0d8] bg-white hover:border-gray-300"
  }`;
}
