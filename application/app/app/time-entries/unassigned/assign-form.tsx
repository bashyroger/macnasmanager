"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

type Project = { id: string; title: string };

export function AssignForm({
  entryId,
  entryTitle,
  projects,
}: {
  entryId: string;
  entryTitle: string;
  projects: Project[];
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) { setError("Please select a project."); return; }
    setError(null);
    setSubmitting(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: dbError } = await (supabase.from("time_entries") as any)
      .update({ project_id: projectId, needs_manual_assignment: false })
      .eq("id", entryId);
    setSubmitting(false);
    if (dbError) { setError(dbError.message); return; }
    setDone(true);
    router.refresh();
  };

  if (done) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle className="w-3.5 h-3.5" /> Assigned
      </span>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="text-xs px-2 py-1.5 rounded-lg border border-[#e5e0d8] bg-white outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] transition-colors min-w-[180px]"
      >
        <option value="">Select project…</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={submitting || !projectId}
        className="px-3 py-1.5 rounded-lg bg-[#be7b3b] text-white text-xs font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
      >
        {submitting ? "…" : "Assign"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
