"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { deleteTimeEntry } from "../../actions";
import { CheckCircle } from "lucide-react";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteFromGoogle, setDeleteFromGoogle] = useState(true);

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
    window.location.href = "/app/time-entries";
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTimeEntry(entry.id, deleteFromGoogle);
      window.location.href = "/app/time-entries";
    } catch (err: any) {
      setError(err.message || "Failed to delete entry");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <Field id="entry-title" label="Title *">
        <input
          id="entry-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass(!title && !!error)}
          placeholder="e.g. Pattern drafting — Sabine bag"
          aria-invalid={!title && !!error}
          aria-required="true"
        />
      </Field>

      <Field id="entry-project" label="Project">
        <select 
          id="entry-project" 
          value={projectId} 
          onChange={(e) => setProjectId(e.target.value)} 
          className={inputClass(false)}
        >
          <option value="">No project (unassigned queue)</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="entry-start" label="Start time *">
          <input
            id="entry-start"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass(false)}
            aria-required="true"
          />
        </Field>
        <Field id="entry-end" label="End time *">
          <input
            id="entry-end"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass(false)}
            aria-required="true"
          />
        </Field>
      </div>

      {durationMinutes !== null && (
        <div className="text-sm bg-[#faf9f7] rounded-lg px-4 py-2.5 flex justify-between" role="status" aria-live="polite">
          <span className="text-gray-500">Duration</span>
          <span className="font-semibold text-[#1a1714] tabular-nums">{formatDuration(durationMinutes)}</span>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors focus:ring-2 focus:ring-[#be7b3b] focus:ring-offset-2"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium text-gray-600 hover:bg-[#faf9f7] transition-colors focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Cancel
        </button>
        {!showDeleteConfirm && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="ml-auto px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
          >
            {deleting ? "Deleting…" : "Delete entry"}
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="mt-6 p-6 rounded-3xl border-2 border-red-100 bg-red-50/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4 items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1714]">Delete this entry?</h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. 
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-red-100 bg-white/50 cursor-pointer hover:bg-white transition-colors group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={deleteFromGoogle}
                  onChange={(e) => setDeleteFromGoogle(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#e5e0d8] bg-white transition-all checked:bg-red-500 checked:border-red-500"
                />
                <CheckCircle className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity pointer-events-none" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1a1714] group-hover:text-red-600 transition-colors">Also delete from Google Calendar</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {deleteFromGoogle 
                    ? "The event will also be permanently removed from your calendar."
                    : "The event will stay in your calendar but will be ignored by future syncs."}
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="px-6 py-2.5 rounded-2xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 ml-auto disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Yes, delete it"}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-2.5 rounded-2xl border-2 border-white bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1a1714] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] ${
    hasError ? "border-red-300 bg-red-50" : "border-[#e5e0d8] bg-white hover:border-gray-300"
  }`;
}
