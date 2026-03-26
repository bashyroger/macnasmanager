import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects" };

const statusColors: Record<string, string> = {
  inquiry: "bg-gray-100 text-gray-600",
  consultation: "bg-blue-100 text-blue-700",
  design: "bg-purple-100 text-purple-700",
  production: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  delivered: "bg-teal-100 text-teal-700",
  archived: "bg-gray-100 text-gray-400",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, status, short_code, clients(full_name), created_at")
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
        <div className="bg-white rounded-xl border border-[#e5e0d8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e0d8] bg-[#faf9f7]">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Project</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Client</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr
                  key={project.id}
                  className={`hover:bg-[#faf9f7] transition-colors ${i < projects.length - 1 ? "border-b border-[#e5e0d8]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/app/projects/${project.id}`} className="font-medium text-[#1a1714] hover:text-[#be7b3b] transition-colors">
                      {project.title}
                    </Link>
                    {project.short_code && (
                      <span className="ml-2 text-xs text-gray-400 font-mono">{project.short_code}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">
                    {(project.clients as { full_name: string } | null)?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/app/projects/${project.id}`}>
                      <ChevronRight className="w-4 h-4 text-gray-300 hover:text-gray-500" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
