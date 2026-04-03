import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectList } from "./project-list";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, status, short_code, clients(full_name), created_at, start_date, target_delivery_date")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1714]">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects?.length ?? 0} active projects</p>
        </div>
        <Link
          href="/app/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New project
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium mb-2">No projects yet</p>
          <p className="text-sm">Create your first project to get started.</p>
        </div>
      ) : (
        <ProjectList projects={projects as any[]} />
      )}
    </div>
  );
}
