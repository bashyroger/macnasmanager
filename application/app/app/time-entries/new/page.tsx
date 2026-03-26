import { createClient } from "@/lib/supabase/server";
import { TimeEntryForm } from "@/app/app/time-entries/new/time-entry-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Log Time" };

export default async function NewTimeEntryPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title")
    .eq("is_archived", false)
    .not("status", "eq", "archived")
    .order("title");

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">
          <Link href="/app/time-entries" className="hover:text-[#be7b3b]">Time entries</Link> /
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1714]">Log time</h1>
      </div>
      <TimeEntryForm projects={projects ?? []} />
    </div>
  );
}
