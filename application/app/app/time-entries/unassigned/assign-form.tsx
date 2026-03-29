"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, PlusCircle, X } from "lucide-react";
import { saveProject } from "@/app/app/projects/actions";
import { slugify } from "@/lib/utils";

type Project = { id: string; title: string };
type Client = { id: string; full_name: string };

export function AssignForm({
  entryId,
  entryTitle,
  projects,
  clients,
}: {
  entryId: string;
  entryTitle: string;
  projects: Project[];
  clients: Client[];
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [isQuickCreate, setIsQuickCreate] = useState(false);
  
  // Quick create fields
  const [newTitle, setNewTitle] = useState(entryTitle);
  const [selectedClientId, setSelectedClientId] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectChange = (val: string) => {
    if (val === "new") {
      setIsQuickCreate(true);
      setProjectId("");
    } else {
      setIsQuickCreate(false);
      setProjectId(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetProjectId = projectId;
    
    setError(null);
    setSubmitting(true);
    
    try {
      // 1. If Quick Create, create the project first
      if (isQuickCreate) {
        if (!newTitle.trim()) throw new Error("Please enter a project title.");
        if (!selectedClientId) throw new Error("Please select a client.");
        
        const payload = {
          client_id: selectedClientId,
          title: newTitle,
          slug: slugify(newTitle),
          status: "inquiry",
          overhead_amount: 0,
        };
        
        const result = await saveProject(undefined, payload);
        if (result.error) throw new Error(result.error);
        if (!result.targetId) throw new Error("Failed to create project.");
        
        targetProjectId = result.targetId;
      }

      if (!targetProjectId) throw new Error("Please select a project.");

      // 2. Assign the time entry
      const supabase = createClient();
      const { error: dbError } = await (supabase.from("time_entries") as any)
        .update({ project_id: targetProjectId, needs_manual_assignment: false })
        .eq("id", entryId);
      
      if (dbError) throw new Error(dbError.message);
      
      setDone(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium animate-in fade-in slide-in-from-left-2 duration-300">
        <CheckCircle className="w-3.5 h-3.5" /> Assigned
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {!isQuickCreate ? (
          <div className="flex items-center gap-2">
            <select
              value={projectId}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border border-[#e5e0d8] bg-white outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] transition-colors min-w-[200px]"
            >
              <option value="">Select project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
              <option value="new" className="text-[#be7b3b] font-medium mt-1">＋ Create new project…</option>
            </select>
            <button
              type="submit"
              disabled={submitting || !projectId}
              className="px-3 py-1.5 rounded-lg bg-[#be7b3b] text-white text-xs font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {submitting ? "…" : "Assign"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-3 bg-[#faf9f7] rounded-xl border border-[#e5e0d8] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Project Create</span>
              <button 
                type="button" 
                onClick={() => setIsQuickCreate(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project Title"
              className="text-xs px-2 py-1.5 rounded-lg border border-[#e5e0d8] bg-white outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] transition-colors"
              autoFocus
            />
            
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border border-[#e5e0d8] bg-white outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] transition-colors"
            >
              <option value="">Select client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>
            
            <button
              type="submit"
              disabled={submitting || !newTitle.trim() || !selectedClientId}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#be7b3b] text-white text-xs font-semibold hover:bg-[#a86330] disabled:opacity-60 transition-colors"
            >
              {submitting ? "Creating…" : (
                <><PlusCircle className="w-3.5 h-3.5" /> Create & Assign</>
              )}
            </button>
          </div>
        )}
      </form>
      {error && <span className="text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">{error}</span>}
    </div>
  );
}
