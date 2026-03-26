"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

type TimeEntry = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  source: string;
  needs_manual_assignment: boolean;
  projects: { title: string } | null;
};

export function TimeEntryList({ entries }: { entries: TimeEntry[] }) {
  const columns: ColumnDef<TimeEntry>[] = [
    {
      header: "Title",
      accessorKey: "title",
      sortable: true,
      cell: (entry) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#1a1714]">{entry.title}</span>
          {entry.needs_manual_assignment && (
            <span className="mt-1 self-start text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">unassigned</span>
          )}
        </div>
      ),
    },
    {
      header: "Project",
      sortable: true,
      className: "hidden md:table-cell text-sm text-gray-500",
      sortAccessor: (e) => e.projects?.title || "",
      cell: (entry) => entry.projects?.title ?? <span className="text-gray-300 italic">none</span>,
    },
    {
      header: "Date/Time",
      accessorKey: "start_time",
      sortable: true,
      className: "hidden sm:table-cell text-sm text-gray-500 tabular-nums",
      cell: (entry) => new Date(entry.start_time).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      header: "Duration",
      accessorKey: "duration_minutes",
      sortable: true,
      cell: (entry) => {
        const hours = Math.floor(entry.duration_minutes / 60);
        const mins = entry.duration_minutes % 60;
        return (
          <span className="text-sm text-[#1a1714] font-medium tabular-nums">
            {hours > 0 ? `${hours}h ` : ""}{mins > 0 ? `${mins}m` : ""}
          </span>
        );
      },
    },
    {
      header: "Source",
      accessorKey: "source",
      sortable: true,
      className: "hidden lg:table-cell",
      cell: (entry) => (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
          entry.source === "google_calendar"
            ? "bg-blue-50 text-blue-600"
            : "bg-gray-50 text-gray-500"
        }`}>
          {entry.source === "google_calendar" ? "Calendar" : "Manual"}
        </span>
      ),
    },
    {
      header: "",
      className: "w-12",
      cell: (entry) => (
        <Link
          href={`/app/time-entries/${entry.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#be7b3b] hover:bg-[#faf9f7] transition-colors inline-flex"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return <DataTable data={entries} columns={columns} />;
}
