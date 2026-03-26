"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Project = { id: string; title: string };

export function TimeEntryEditForm({
  entry,
  projects,
}: {
  entry: {
    id: string;
    title: string;
    project_id: string | null;
    start_time: string;
    end_time: string;
    duration_minutes: number;
  };
  projects: Project[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(entry.title);
  const [projectId, setProjectId] = useState(entry.project_id ?? "");
  const [startTime, setStartTime] = useState(toDatetimeLocal(new Date(entry.start_time)));
  const [endTime, setEndTime] = useState(toDatetimeLocal(new Date(entry.end_time)));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const durationMinutes = (() => {
    if (!startTime || !endTime) return null;
    const s = new Date(startTime).getTime();
    const e = new Date(endTime).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return null;
    return Math.ceil((e - s) / 60000); // BR-001
  })();

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m` : ""}`.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError("Title is required."); return; }
    if (!startTime || !endTime) { setError("Start and end time are required."); return; }
    if (durationMinutes === null || durationMinutes <= 0) { setError("End time must be after start time."); return; }

    setSubmitting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase.from("time_entries") as any)
      .update({
        title: title.trim(),
        project_id: projectId || null,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        duration_minutes: durationMinutes,
        needs_manual_assignment: !projectId,
      })
      .eq("id", entry.id);

    setSubmitting(false);
    if (dbError) { setError(dbError.message); return; }
    router.push("/app/time-entries");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this time entry? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase.from("time_entries") as any).delete().eq("id", entry.id);
    setDeleting(false);
    if (dbError) { setError(dbError.message); return; }
    router.push("/app/time-entries");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <Field label="Title *">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass(!title && !!error)}
          placeholder="e.g. Pattern drafting — Sabine bag"
        />
      </Field>

      <Field label="Project">
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={inputClass(false)}>
          <option value="">No project (unassigned queue)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start time *">
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass(false)}
          />
        </Field>
        <Field label="End time *">
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      {durationMinutes !== null && (
        <div className="text-sm bg-[#faf9f7] rounded-lg px-4 py-2.5 flex justify-between">
          <span className="text-gray-500">Duration</span>
          <span className="font-semibold text-[#1a1714] tabular-nums">{formatDuration(durationMinutes)}</span>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium text-gray-600 hover:bg-[#faf9f7] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
        >
          {deleting ? "Deleting…" : "Delete entry"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1714] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] ${
    hasError ? "border-red-300 bg-red-50" : "border-[#e5e0d8] bg-white hover:border-gray-300"
  }`;
}
