import { MaterialForm } from "@/app/app/materials/material-form";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Material" };

export default async function NewMaterialPage() {
  const supabase = await createClient();
  const { data: axes } = await supabase
    .from("sustainability_axes")
    .select("id, name, description")
    .eq("is_active", true)
    .order("display_order");

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/materials" className="hover:text-[#be7b3b]">Materials</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">New material</h1>
      </div>
      <MaterialForm activeAxes={axes ?? []} />
    </div>
  );
}
