"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logTimeManualEntry } from "../actions";

type Project = { id: string; title: string };

/** Format a Date as the value needed by datetime-local input: "YYYY-MM-DDTHH:mm" */
function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const now = new Date();
const defaultStart = toDatetimeLocal(now);
const defaultEnd = toDatetimeLocal(new Date(now.getTime() + 60 * 60 * 1000)); // +1 hour

export function TimeEntryForm({ 
  projects,
  initialStart,
  initialEnd
}: { 
  projects: Project[],
  initialStart?: string,
  initialEnd?: string
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [startTime, setStartTime] = useState(initialStart ? toDatetimeLocal(new Date(initialStart)) : defaultStart);
  const [endTime, setEndTime] = useState(initialEnd ? toDatetimeLocal(new Date(initialEnd)) : defaultEnd);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Compute duration preview
  const durationMinutes = (() => {
    if (!startTime || !endTime) return null;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return null;
    return Math.ceil((end - start) / 60000); // BR-001
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
    
    try {
      await logTimeManualEntry({
        title: title.trim(),
        projectId: projectId || null,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMinutes: durationMinutes,
      });
    } catch (err: any) {
      setSubmitting(false);
      setError(err.message);
      return;
    }

    setSubmitting(false);
    window.location.href = "/app/time-entries";
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
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={inputClass(false)}
        >
          <option value="">No project (will go to unassigned queue)</option>
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

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
        >
          {submitting ? "Saving…" : "Log time"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium text-gray-600 hover:bg-[#faf9f7] transition-colors"
        >
          Cancel
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
