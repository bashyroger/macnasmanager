"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

type Client = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_archived: boolean;
  created_at: string;
};

export function ClientList({ clients }: { clients: Client[] }) {
  const columns: ColumnDef<Client>[] = [
    {
      header: "Name",
      accessorKey: "full_name",
      sortable: true,
      cell: (client) => (
        <Link 
          href={`/app/clients/${client.id}`} 
          className="font-medium text-[#1a1714] hover:text-[#be7b3b] transition-colors text-sm"
        >
          {client.full_name}
        </Link>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
      className: "hidden md:table-cell text-sm text-gray-500",
      cell: (client) => client.email ?? "—",
    },
    {
      header: "Added",
      accessorKey: "created_at",
      sortable: true,
      className: "hidden lg:table-cell text-sm text-gray-400",
      cell: (client) => formatDate(client.created_at),
    },
    {
      header: "",
      className: "w-10",
      cell: (client) => (
        <Link href={`/app/clients/${client.id}`}>
          <ChevronRight className="w-4 h-4 text-gray-300 hover:text-gray-500" />
        </Link>
      ),
    },
  ];

  return <DataTable data={clients} columns={columns} />;
}
