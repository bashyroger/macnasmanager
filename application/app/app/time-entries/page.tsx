import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, Clock, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Time Entries" };

export default async function TimeEntriesPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("time_entries")
    .select("id, title, start_time, end_time, duration_minutes, source, needs_manual_assignment, projects(title)")
    .order("start_time", { ascending: false })
    .limit(100);

  const { count: unassignedCount } = await supabase
    .from("time_entries")
    .select("*", { count: "exact", head: true })
    .eq("needs_manual_assignment", true);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1714]">Time Entries</h1>
          <p className="text-sm text-gray-500 mt-0.5">{entries?.length ?? 0} recent entries</p>
        </div>
        <Link
          href="/app/time-entries/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log time
        </Link>
      </div>

      {/* Unassigned alert */}
      {(unassignedCount ?? 0) > 0 && (
        <Link
          href="/app/time-entries/unassigned"
          className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{unassignedCount} time {unassignedCount === 1 ? "entry needs" : "entries need"} project assignment</span>
          <span className="ml-auto text-xs">Review →</span>
        </Link>
      )}

      {!entries || entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium mb-2">No time entries yet</p>
          <p className="text-sm">Log time manually or sync via Google Calendar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Project</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Source</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const hours = Math.floor(entry.duration_minutes / 60);
                const mins = entry.duration_minutes % 60;
                const project = entry.projects as { title: string } | null;

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-[#faf9f7] transition-colors ${i < entries.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#1a1714]">{entry.title}</span>
                      {entry.needs_manual_assignment && (
                        <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">
                      {project?.title ?? <span className="text-gray-300 italic">none</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1a1714] font-medium tabular-nums">
                      {hours > 0 ? `${hours}h ` : ""}{mins > 0 ? `${mins}m` : ""}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        entry.source === "google_calendar"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-50 text-gray-500"
                      }`}>
                        {entry.source === "google_calendar" ? "Calendar" : "Manual"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
