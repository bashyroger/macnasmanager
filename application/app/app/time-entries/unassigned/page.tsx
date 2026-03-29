import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { AssignForm } from "@/app/app/time-entries/unassigned/assign-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Unassigned Time Entries" };

export default async function UnassignedTimeEntriesPage() {
  const supabase = await createClient();

  const [{ data: responseEntries }, { data: projects }, { data: clients }] = await Promise.all([
    supabase
      .from("time_entries")
      .select("id, title, start_time, duration_minutes, source")
      .eq("needs_manual_assignment", true)
      .order("start_time", { ascending: false }),
    supabase
      .from("projects")
      .select("id, title")
      .eq("is_archived", false)
      .not("status", "eq", "archived")
      .order("title"),
    supabase
      .from("clients")
      .select("id, full_name")
      .eq("is_archived", false)
      .order("full_name"),
  ]);

  const entries = responseEntries as any[] | null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">
            <Link href="/app/time-entries" className="hover:text-[#be7b3b]">Time entries</Link> /
          </p>
          <h1 className="text-2xl font-semibold text-[#1a1714]">Unassigned entries</h1>
          <p className="text-sm text-gray-500 mt-0.5">{entries?.length ?? 0} entries need project assignment</p>
        </div>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium mb-2">All caught up</p>
          <p className="text-sm">No time entries need assignment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Assign to project</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const h = Math.floor(entry.duration_minutes / 60);
                const m = entry.duration_minutes % 60;
                const date = new Date(entry.start_time).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                });
                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-[#faf9f7] transition-colors ${i < entries.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#1a1714]">{entry.title}</span>
                      {entry.source === "google_calendar" && (
                        <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Calendar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#1a1714] tabular-nums">
                      {h > 0 ? `${h}h ` : ""}{m > 0 ? `${m}m` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <AssignForm
                        entryId={entry.id}
                        entryTitle={entry.title}
                        projects={projects ?? []}
                        clients={clients ?? []}
                      />
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
