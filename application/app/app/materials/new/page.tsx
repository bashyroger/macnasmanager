import { MaterialForm } from "@/app/app/materials/material-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Material" };

export default function NewMaterialPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/materials" className="hover:text-[#be7b3b]">Materials</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">New material</h1>
      </div>
      <MaterialForm />
    </div>
  );
}
