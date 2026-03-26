import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ClientForm } from "../client-form";
import { Pencil, FolderKanban } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("full_name").eq("id", id).single();
  return { title: data?.full_name ?? "Client" };
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: client }, { data: projects }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("projects")
      .select("id, title, status, created_at")
      .eq("client_id", id)
      .eq("is_archived", false)
      .order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();

  const statusColors: Record<string, string> = {
    inquiry: "bg-gray-100 text-gray-600",
    consultation: "bg-blue-100 text-blue-700",
    design: "bg-purple-100 text-purple-700",
    production: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    delivered: "bg-teal-100 text-teal-700",
    archived: "bg-gray-100 text-gray-400",
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-400 mb-1">
            <Link href="/app/clients" className="hover:text-[#be7b3b]">Clients</Link> /
          </p>
          <h1 className="text-2xl font-semibold text-[#1a1714]">{client.full_name}</h1>
        </div>
        <Link
          href={`/app/clients/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e5e0d8] text-sm font-medium hover:bg-[#faf9f7] transition-colors"
        >
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-[#e5e0d8] divide-y divide-[#e5e0d8]">
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1a1714]">Profile</h2>
          </div>
          {[
            { label: "Email", value: client.email },
            { label: "Phone", value: client.phone },
            { label: "Instagram", value: client.instagram_handle },
            { label: "Added", value: formatDate(client.created_at) },
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-3 flex gap-4">
              <span className="text-xs text-gray-400 w-24 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-sm text-[#1a1714]">{value ?? "—"}</span>
            </div>
          ))}
        </div>

        {/* Notes + preferences */}
        <div className="bg-white rounded-xl border border-[#e5e0d8] divide-y divide-[#e5e0d8]">
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-[#1a1714]">Notes & Preferences</h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">Style preferences</p>
            <p className="text-sm text-[#1a1714] whitespace-pre-wrap">{client.preferences || "—"}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">Internal notes</p>
            <p className="text-sm text-[#1a1714] whitespace-pre-wrap">{client.notes || "—"}</p>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-xl border border-[#e5e0d8]">
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#e5e0d8]">
          <h2 className="text-sm font-semibold text-[#1a1714]">Projects ({projects?.length ?? 0})</h2>
          <Link
            href={`/app/projects/new?client=${id}`}
            className="text-xs text-[#be7b3b] hover:underline font-medium"
          >
            + New project
          </Link>
        </div>
        {!projects || projects.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No projects yet</div>
        ) : (
          <ul className="divide-y divide-[#e5e0d8]">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/app/projects/${project.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#faf9f7] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span className="text-sm font-medium text-[#1a1714]">{project.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {project.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
