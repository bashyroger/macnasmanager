import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("title").eq("id", id).single();
  return { title: `Time — ${data?.title ?? "Project"}` };
}

export default async function ProjectTimePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: entries }] = await Promise.all([
    supabase.from("projects").select("id, title").eq("id", id).single(),
    supabase
      .from("time_entries")
      .select("id, title, start_time, duration_minutes, source")
      .eq("project_id", id)
      .order("start_time", { ascending: false }),
  ]);

  if (!project) notFound();

  const totalMinutes = (entries ?? []).reduce((sum, e) => sum + e.duration_minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  const tabs = [
    { label: "Overview", href: `/app/projects/${id}` },
    { label: "Materials", href: `/app/projects/${id}/materials` },
    { label: "Time", href: `/app/projects/${id}/time` },
    { label: "Finances", href: `/app/projects/${id}/finances` },
    { label: "Publish", href: `/app/projects/${id}/publish` },
  ];

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /{" "}
          <Link href={`/app/projects/${id}`} className="hover:text-[#be7b3b]">{project.title}</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Time</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e5e0d8]">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab.label === "Time"
                ? "text-[#1a1714] border-[#be7b3b]"
                : "text-gray-500 hover:text-[#1a1714] border-transparent hover:border-[#be7b3b]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Total banner */}
      {(entries ?? []).length > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-[#e5e0d8] px-5 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Total time logged</span>
          <span className="text-lg font-semibold text-[#1a1714] tabular-nums">
            {totalHours}h {remainingMins}m
          </span>
        </div>
      )}

      {/* Entries list */}
      {!entries || entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium mb-2">No time logged yet</p>
          <p className="text-sm">
            <Link href="/app/time-entries/new" className="text-[#be7b3b] hover:underline">Log time</Link> or sync via Google Calendar.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 font-medium">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell font-medium">Date/Time</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 font-medium">Duration</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const h = Math.floor(entry.duration_minutes / 60);
                const m = entry.duration_minutes % 60;
                const dateTime = new Date(entry.start_time).toLocaleString("en-GB", { 
                  day: "numeric", 
                  month: "short", 
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return (
                  <tr key={entry.id} className={`hover:bg-[#faf9f7] transition-colors ${i < entries.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1a1714]">{entry.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell tabular-nums">{dateTime}</td>
                    <td className="px-4 py-3 text-sm text-[#1a1714] font-medium tabular-nums">{h > 0 ? `${h}h ` : ""}{m > 0 ? `${m}m` : ""}</td>
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
