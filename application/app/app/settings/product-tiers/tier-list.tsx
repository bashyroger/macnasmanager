"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Check, X } from "lucide-react";

type Tier = {
  id: string;
  code: string;
  label: string;
  min_total_cost: number | null;
  min_labor_hours: number | null;
  sort_order: number;
  is_active: boolean;
  rule_json: any;
};

export function TierList({ initialTiers }: { initialTiers: Tier[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [minTotalCost, setMinTotalCost] = useState<string>("");
  const [minLaborHours, setMinLaborHours] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const startEdit = (tier: Tier) => {
    setEditingId(tier.id);
    setCode(tier.code);
    setLabel(tier.label);
    setMinTotalCost(tier.min_total_cost !== null ? String(tier.min_total_cost) : "");
    setMinLaborHours(tier.min_labor_hours !== null ? String(tier.min_labor_hours) : "");
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setCode("");
    setLabel("");
    setMinTotalCost("");
    setMinLaborHours("");
    setIsAdding(true);
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!code.trim() || !label.trim()) return alert("Code and label are required");
    setLoading(true);

    const payload = {
      code: code.trim().toUpperCase(),
      label: label.trim(),
      min_total_cost: minTotalCost === "" ? null : Number(minTotalCost),
      min_labor_hours: minLaborHours === "" ? null : Number(minLaborHours),
      rule_json: {}, // Empty for now, logic relies on the min columns first
      sort_order: isAdding ? initialTiers.length : undefined, // append to end
    };

    if (isAdding) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("product_tiers") as any).insert(payload);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("product_tiers") as any).update(payload).eq("id", editingId);
    }

    setLoading(false);
    cancel();
    router.refresh();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("product_tiers") as any).update({ is_active: !currentStatus }).eq("id", id);
    router.refresh();
  };

  return (
    <div>
      <div className="px-5 py-3 border-b border-[#e5e0d8] bg-[#faf9f7] flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <div className="flex gap-4 w-full">
          <div className="w-16">Code</div>
          <div className="w-48">Label</div>
          <div className="w-32">Min Cost (€)</div>
          <div className="w-32">Min Labor (hrs)</div>
          <div className="w-20">Status</div>
        </div>
        <button onClick={startAdd} disabled={isAdding || !!editingId} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#be7b3b] text-white text-xs font-medium hover:bg-[#a86330] disabled:opacity-50 transition-colors">
          <Plus className="w-3 h-3" /> Add tier
        </button>
      </div>

      <ul className="divide-y divide-[#e5e0d8]">
        {initialTiers.map((tier) => (
          <li key={tier.id} className="p-5">
            {editingId === tier.id ? (
              <EditForm 
                code={code} setCode={setCode}
                label={label} setLabel={setLabel}
                minTotalCost={minTotalCost} setMinTotalCost={setMinTotalCost}
                minLaborHours={minLaborHours} setMinLaborHours={setMinLaborHours}
                onSave={handleSave} onCancel={cancel} loading={loading}
              />
            ) : (
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4 w-full items-center">
                  <div className="w-16 font-mono font-bold text-[#1a1714]">{tier.code}</div>
                  <div className="w-48 font-medium text-[#1a1714]">{tier.label}</div>
                  <div className="w-32 text-gray-500 tabular-nums">{tier.min_total_cost !== null ? `€${tier.min_total_cost}` : "—"}</div>
                  <div className="w-32 text-gray-500 tabular-nums">{tier.min_labor_hours !== null ? `${tier.min_labor_hours}h` : "—"}</div>
                  <div className="w-20">
                    <button onClick={() => toggleActive(tier.id, tier.is_active)} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.is_active ? "bg-green-100 text-green-700 hover:bg-red-100" : "bg-gray-100 text-gray-500 hover:bg-green-100"}`}>
                      {tier.is_active ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
                <button onClick={() => startEdit(tier)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#be7b3b] hover:bg-[#faf9f7]">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </li>
        ))}

        {isAdding && (
          <li className="p-5 bg-amber-50/30">
            <EditForm 
              code={code} setCode={setCode}
              label={label} setLabel={setLabel}
              minTotalCost={minTotalCost} setMinTotalCost={setMinTotalCost}
              minLaborHours={minLaborHours} setMinLaborHours={setMinLaborHours}
              onSave={handleSave} onCancel={cancel} loading={loading}
            />
          </li>
        )}

        {initialTiers.length === 0 && !isAdding && (
          <li className="p-8 text-center text-sm text-gray-500">No product tiers defined.</li>
        )}
      </ul>
      <div className="px-5 py-3 border-t border-[#e5e0d8] bg-gray-50 text-xs text-gray-400">
        Tiers are evaluated top-to-bottom. The first tier where conditions are met matches.
      </div>
    </div>
  );
}

function EditForm({
  code, setCode, label, setLabel, minTotalCost, setMinTotalCost, minLaborHours, setMinLaborHours, onSave, onCancel, loading
}: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b] uppercase" placeholder="e.g. T1" autoFocus />
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b]" placeholder="e.g. Masterpiece" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Total Cost (€) (Optional)</label>
          <input type="number" step="1" value={minTotalCost} onChange={(e) => setMinTotalCost(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b]" placeholder="Disabled if empty" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Labor Hours (Optional)</label>
          <input type="number" step="0.5" value={minLaborHours} onChange={(e) => setMinLaborHours(e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#be7b3b]" placeholder="Disabled if empty" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button onClick={onSave} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#be7b3b] text-white text-xs font-medium hover:bg-[#a86330] disabled:opacity-50">
          <Check className="w-3.5 h-3.5" /> Save tier
        </button>
        <button onClick={onCancel} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-50">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}
