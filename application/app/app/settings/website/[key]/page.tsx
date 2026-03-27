import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { WebsitePageForm } from "../webpage-form";

export default async function EditWebsitePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("website_pages")
    .select("*")
    .eq("page_key", key)
    .single();

  if (!page) notFound();

  return <WebsitePageForm page={page} />;
}
