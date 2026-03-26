import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TimeEntryEditForm } from "./time-entry-edit-form";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("time_entries") as any).select("title").eq("id", id).single();
  return { title: `Edit — ${data?.title ?? "Time entry"}` };
}

export default async function EditTimeEntryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: entry }, { data: projects }] = await Promise.all([
    supabase
      .from("time_entries")
      .select("id, title, project_id, start_time, end_time, duration_minutes")
      .eq("id", id)
      .single(),
    supabase
      .from("projects")
      .select("id, title")
      .eq("is_archived", false)
      .order("title"),
  ]);

  if (!entry) notFound();

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/time-entries" className="hover:text-[#be7b3b]">Time entries</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Edit time entry</h1>
      </div>
      <TimeEntryEditForm entry={entry} projects={projects ?? []} />
    </div>
  );
}
