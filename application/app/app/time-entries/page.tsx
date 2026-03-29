import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertCircle, Clock, Plus } from "lucide-react";
import { TimeEntryList } from "./time-entry-list";
import { TimeEntriesView } from "./time-entries-view";
import type { Metadata } from "next";

import { SyncCalendarButton } from "./sync-calendar-button";

export const metadata: Metadata = { title: "Time Entries" };

export default async function TimeEntriesPage() {
  const supabase = await createClient();
  const response = await supabase
    .from("time_entries")
    .select("id, title, start_time, end_time, duration_minutes, source, needs_manual_assignment, projects(title)")
    .order("start_time", { ascending: false })
    .limit(100);
  const entries = response.data as any[] | null;

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
        <div className="flex items-center gap-3">
          <SyncCalendarButton />
          <Link
            href="/app/time-entries/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log time
          </Link>
        </div>
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

      {/* Render the unified list/calendar toggle wrapper */}
      <TimeEntriesView entries={entries ?? []} />
    </div>
  );
}
