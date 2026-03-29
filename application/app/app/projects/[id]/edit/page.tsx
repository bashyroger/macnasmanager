import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "../../project-form";
import Link from "next/link";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [pResult, cResult] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("clients").select("id, full_name").order("full_name"),
  ]);

  const project = pResult.data as any;
  const clients = cResult.data;

  if (!project) redirect("/app/projects");

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/projects" className="hover:text-[#be7b3b]">Projects</Link> /{" "}
          <Link href={`/app/projects/${id}`} className="hover:text-[#be7b3b]">{project.title}</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Edit project</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e0d8] p-6">
        <ProjectForm 
          clients={clients ?? []} 
          projectId={id}
          defaultValues={{
            client_id: project.client_id,
            title: project.title,
            slug: project.slug,
            short_code: project.short_code ?? undefined,
            status: project.status as any,
            hourly_rate_snapshot: project.hourly_rate_snapshot ?? undefined,
            start_date: project.start_date ?? undefined,
            target_delivery_date: project.target_delivery_date ?? undefined,
            overhead_amount: project.overhead_amount ?? 0,
            private_notes: project.private_notes ?? undefined,
            public_title: project.public_title ?? undefined,
            public_description: project.public_description ?? undefined,
            hero_image_path: project.hero_image_path ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
