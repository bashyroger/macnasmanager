import { createClient } from "@/lib/supabase/server";
import { AxisList } from "./axis-list";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sustainability Settings" };

export default async function SustainabilitySettingsPage() {
  const supabase = await createClient();
  const { data: axes } = await supabase
    .from("sustainability_axes")
    .select("*")
    .order("display_order");

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1714]">Sustainability Axes</h1>
        <p className="text-sm text-gray-500 mt-0.5">Define the evaluation criteria for product sustainability scoring.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
        <AxisList initialAxes={axes ?? []} />
      </div>
    </div>
  );
}
