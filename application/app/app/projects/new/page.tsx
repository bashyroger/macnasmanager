import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "../project-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: defaultClientId } = await searchParams;
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("is_archived", false)
    .order("full_name");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1714] mb-8">New project</h1>
      <ProjectForm clients={clients ?? []} defaultClientId={defaultClientId} />
    </div>
  );
}
