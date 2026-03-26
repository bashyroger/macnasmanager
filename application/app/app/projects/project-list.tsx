"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

const statusColors: Record<string, string> = {
  inquiry: "bg-gray-100 text-gray-600",
  consultation: "bg-blue-100 text-blue-700",
  design: "bg-purple-100 text-purple-700",
  production: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  delivered: "bg-teal-100 text-teal-700",
  archived: "bg-gray-100 text-gray-400",
};

type Project = {
  id: string;
  title: string;
  slug: string;
  status: string;
  short_code: string | null;
  clients: { full_name: string } | null;
  created_at: string;
};

export function ProjectList({ projects }: { projects: Project[] }) {
  const columns: ColumnDef<Project>[] = [
    {
      header: "Project",
      accessorKey: "title",
      sortable: true,
      cell: (project) => (
        <div className="flex flex-col">
          <Link 
            href={`/app/projects/${project.id}`} 
            className="font-medium text-[#1a1714] hover:text-[#be7b3b] transition-colors text-sm"
          >
            {project.title}
          </Link>
          {project.short_code && (
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{project.short_code}</span>
          )}
        </div>
      ),
    },
    {
      header: "Client",
      sortable: true,
      className: "hidden md:table-cell text-sm text-gray-500",
      sortAccessor: (p) => p.clients?.full_name || "",
      cell: (project) => project.clients?.full_name ?? "—",
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (project) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${statusColors[project.status] ?? "bg-gray-100 text-gray-500"}`}>
          {project.status}
        </span>
      ),
    },
    {
      header: "",
      className: "w-10",
      cell: (project) => (
        <Link href={`/app/projects/${project.id}`}>
          <ChevronRight className="w-4 h-4 text-gray-300 hover:text-gray-500" />
        </Link>
      ),
    },
  ];

  return <DataTable data={projects} columns={columns} />;
}
