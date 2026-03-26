import { ImportForm } from "@/app/app/materials/import/import-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Import Materials" };

export default function ImportMaterialsPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/materials" className="hover:text-[#be7b3b]">Materials</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Import from CSV</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Existing materials with the same name will be updated. New materials will be created.
        </p>
      </div>
      <ImportForm />
    </div>
  );
}
