"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Check, X } from "lucide-react";

type Axis = {
  id: string;
  name: string;
  description: string | null;
  weight: number;
  grade_a_min: number;
  grade_b_min: number;
  grade_c_min: number;
  display_order: number;
  is_active: boolean;
};

export function AxisList({ initialAxes }: { initialAxes: Axis[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState(1);
  const [aMin, setAMin] = useState(90);
  const [bMin, setBMin] = useState(75);
  const [cMin, setCMin] = useState(50);
  const [loading, setLoading] = useState(false);

  const startEdit = (axis: Axis) => {
    setEditingId(axis.id);
    setName(axis.name);
    setDescription(axis.description ?? "");
    setWeight(axis.weight);
    setAMin(axis.grade_a_min);
    setBMin(axis.grade_b_min);
    setCMin(axis.grade_c_min);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setWeight(1);
    setAMin(90);
    setBMin(75);
    setCMin(50);
    setIsAdding(true);
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Name is required");
    setLoading(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      weight,
      grade_a_min: aMin,
      grade_b_min: bMin,
      grade_c_min: cMin,
      display_order: isAdding ? initialAxes.length : undefined, // simple append for new
    };

    if (isAdding) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function insertAxis() { return (supabase.from("sustainability_axes") as any).insert(payload); }
      await insertAxis();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function updateAxis() { return (supabase.from("sustainability_axes") as any).update(payload).eq("id", editingId); }
      await updateAxis();
    }

    setLoading(false);
    cancel();
    router.refresh();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("sustainability_axes") as any).update({ is_active: !currentStatus }).eq("id", id);
    router.refresh();
  };

  return (
    <div>
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-[#e5e0d8] bg-[#faf9f7] flex justify-between items-center">
        <div className="flex text-xs font-semibold text-gray-500 uppercase tracking-wide gap-4">
          <div className="w-48">Axis Name</div>
          <div className="w-16 text-center">Weight</div>
          <div className="w-32 text-center">Grades (A/B/C)</div>
          <div className="w-20 text-center">Status</div>
        </div>
        <button
          onClick={startAdd}
          disabled={isAdding || !!editingId}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#be7b3b] text-white text-xs font-medium hover:bg-[#a86330] disabled:opacity-50 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add axis
        </button>
      </div>

      {/* List */}
      <ul className="divide-y divide-[#e5e0d8]">
        {initialAxes.map((axis) => (
          <li key={axis.id} className="p-5 flex flex-col gap-3">
            {editingId === axis.id ? (
              <EditForm
                name={name} setName={setName}
                desc={description} setDesc={setDescription}
                weight={weight} setWeight={setWeight}
                aMin={aMin} setAMin={setAMin}
                bMin={bMin} setBMin={setBMin}
                cMin={cMin} setCMin={setCMin}
                onSave={handleSave} onCancel={cancel} loading={loading}
              />
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="w-48">
                  <p className="text-sm font-semibold text-[#1a1714]">{axis.name}</p>
                  {axis.description && <p className="text-xs text-gray-500 truncate mt-0.5">{axis.description}</p>}
                </div>
                <div className="w-16 text-center text-sm font-medium tabular-nums">{axis.weight}</div>
                <div className="w-32 text-center text-xs text-gray-500 tabular-nums">
                  &gt;{axis.grade_a_min} / &gt;{axis.grade_b_min} / &gt;{axis.grade_c_min}
                </div>
                <div className="w-20 text-center">
                  <button
                    onClick={() => toggleActive(axis.id, axis.is_active)}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                      axis.is_active ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
                    }`}
                    title={axis.is_active ? "Click to disable" : "Click to enable"}
                  >
                    {axis.is_active ? "Active" : "Disabled"}
                  </button>
                </div>
                <div className="flex items-center gap-2 w-16 justify-end">
                  <button onClick={() => startEdit(axis)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#be7b3b] hover:bg-[#faf9f7] transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}

        {isAdding && (
          <li className="p-5 bg-amber-50/30">
            <EditForm
              name={name} setName={setName}
              desc={description} setDesc={setDescription}
              weight={weight} setWeight={setWeight}
              aMin={aMin} setAMin={setAMin}
              bMin={bMin} setBMin={setBMin}
              cMin={cMin} setCMin={setCMin}
              onSave={handleSave} onCancel={cancel} loading={loading}
            />
          </li>
        )}

        {initialAxes.length === 0 && !isAdding && (
          <li className="p-8 text-center text-sm text-gray-500">No sustainability axes defined yet.</li>
        )}
      </ul>
    </div>
  );
}

function EditForm({
  name, setName, desc, setDesc, weight, setWeight,
  aMin, setAMin, bMin, setBMin, cMin, setCMin,
  onSave, onCancel, loading
}: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Axis Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b]" placeholder="e.g. CO2 Footprint" autoFocus />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Weight (multiplier)</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b]" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b]" placeholder="Short explanation of what this measures" />
      </div>
      <div className="grid grid-cols-3 gap-4 bg-white p-3 rounded-lg border border-gray-100 border-dashed">
        <div>
          <label className="block text-xs font-medium text-green-600 mb-1">Grade A Minimum</label>
          <input type="number" step="0.1" value={aMin} onChange={(e) => setAMin(Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-green-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-600 mb-1">Grade B Minimum</label>
          <input type="number" step="0.1" value={bMin} onChange={(e) => setBMin(Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-amber-600 mb-1">Grade C Minimum</label>
          <input type="number" step="0.1" value={cMin} onChange={(e) => setCMin(Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-amber-400" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button onClick={onSave} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#be7b3b] text-white text-xs font-medium hover:bg-[#a86330] disabled:opacity-50 transition-colors">
          <Check className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save axis"}
        </button>
        <button onClick={onCancel} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}
