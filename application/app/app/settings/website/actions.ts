"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function updateWebsitePage(id: string, data: { title: string; body_json: any }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("website_pages")
    .update({
      title: data.title,
      body_json: data.body_json,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating website page:", error);
    return { error: error.message };
  }

  await logAction("update", "website_page", id, { title: data.title });

  revalidatePath("/app/settings/website");
  revalidatePath("/");
  revalidatePath(`/${data.body_json.slug || ""}`);

  return { success: true };
}
