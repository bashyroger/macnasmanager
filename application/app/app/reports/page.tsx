import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Clock, BarChart2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  const supabase = await createClient();

  // Weekly summary (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: weekEntries }, { data: monthEntries }, { data: projectSummary }] = await Promise.all([
    supabase
      .from("time_entries")
      .select("duration_minutes, projects(title)")
      .gte("start_time", weekAgo),
    supabase
      .from("time_entries")
      .select("duration_minutes")
      .gte("start_time", monthAgo),
    supabase
      .from("projects")
      .select("id, title, hourly_rate_snapshot")
      .eq("is_archived", false)
      .in("status", ["design", "production", "consultation"])
      .order("title"),
  ]);

  const weekMinutes = (weekEntries ?? []).reduce((s, e) => s + e.duration_minutes, 0);
  const monthMinutes = (monthEntries ?? []).reduce((s, e) => s + e.duration_minutes, 0);

  const fmtHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1714]">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Time and financial summaries</p>
      </div>

      {/* Time summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg">
        <StatCard
          label="This week"
          value={fmtHours(weekMinutes)}
          sub="last 7 days"
          icon={<Clock className="w-5 h-5 text-[#be7b3b]" />}
        />
        <StatCard
          label="This month"
          value={fmtHours(monthMinutes)}
          sub="last 30 days"
          icon={<BarChart2 className="w-5 h-5 text-[#be7b3b]" />}
        />
      </div>

      {/* Per-project breakdown (week) */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Weekly breakdown by project</h2>
        {!weekEntries || weekEntries.length === 0 ? (
          <p className="text-sm text-gray-400">No time logged in the past 7 days.</p>
        ) : (() => {
          const byProject: Record<string, number> = {};
          weekEntries.forEach((e) => {
            const name = (e.projects as { title: string } | null)?.title ?? "Unassigned";
            byProject[name] = (byProject[name] ?? 0) + e.duration_minutes;
          });
          return (
            <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden max-w-lg">
              {Object.entries(byProject).sort((a, b) => b[1] - a[1]).map(([name, mins], i, arr) => (
                <div
                  key={name}
                  className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
                >
                  <span className="text-sm text-[#1a1714]">{name}</span>
                  <span className="text-sm font-semibold tabular-nums text-[#1a1714]">{fmtHours(mins)}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Active projects quick-stat */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Active projects</h2>
        {!projectSummary || projectSummary.length === 0 ? (
          <p className="text-sm text-gray-400">No active projects.</p>
        ) : (
          <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden max-w-lg">
            {projectSummary.map((p, i) => (
              <Link
                key={p.id}
                href={`/app/projects/${p.id}`}
                className={`flex items-center justify-between px-4 py-3 hover:bg-[#faf9f7] transition-colors ${i < projectSummary.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
              >
                <span className="text-sm text-[#1a1714]">{p.title}</span>
                {p.hourly_rate_snapshot && (
                  <span className="text-xs text-gray-400">{formatCurrency(p.hourly_rate_snapshot)}/hr</span>
                )}
              </Link>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-3">
          Full per-project finance reports will be available in Phase 3. See{" "}
          <Link href="/app/projects" className="text-[#be7b3b] hover:underline">Projects → Finances tab</Link> for individual breakdowns.
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e0d8] px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#1a1714] tabular-nums">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
