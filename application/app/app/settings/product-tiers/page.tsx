import { createClient } from "@/lib/supabase/server";
import { TierList } from "./tier-list";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Product Tiers" };

export default async function ProductTiersPage() {
  const supabase = await createClient();
  const { data: tiers } = await supabase
    .from("product_tiers")
    .select("*")
    .order("sort_order");

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1714]">Product Tiers</h1>
        <p className="text-sm text-gray-500 mt-0.5">Define deterministic rules that automatically assign quality tiers to a project upon snapshot completion.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
        <TierList initialTiers={tiers ?? []} />
      </div>
    </div>
  );
}
