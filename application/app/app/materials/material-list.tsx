"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

type Material = {
  id: string;
  name: string;
  unit: string;
  cost_per_unit: number;
  supplier_name: string | null;
  is_archived: boolean;
};

export function MaterialList({ materials }: { materials: Material[] }) {
  const columns: ColumnDef<Material>[] = [
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (material) => (
        <Link 
          href={`/app/materials/${material.id}`} 
          className="font-medium text-[#1a1714] hover:text-[#be7b3b] transition-colors text-sm"
        >
          {material.name}
        </Link>
      ),
    },
    {
      header: "Unit",
      accessorKey: "unit",
      sortable: true,
      className: "hidden md:table-cell text-sm text-gray-500",
      cell: (material) => material.unit,
    },
    {
      header: "Cost/unit",
      accessorKey: "cost_per_unit",
      sortable: true,
      cell: (material) => (
        <span className="text-sm text-[#1a1714] font-medium tabular-nums">
          {formatCurrency(material.cost_per_unit)}
        </span>
      ),
    },
    {
      header: "Supplier",
      accessorKey: "supplier_name",
      sortable: true,
      className: "hidden lg:table-cell text-sm text-gray-400",
      cell: (material) => material.supplier_name ?? "—",
    },
    {
      header: "",
      className: "w-10",
      cell: (material) => (
        <Link href={`/app/materials/${material.id}`}>
          <ChevronRight className="w-4 h-4 text-gray-300 hover:text-gray-500" />
        </Link>
      ),
    },
  ];

  return <DataTable data={materials} columns={columns} />;
}
