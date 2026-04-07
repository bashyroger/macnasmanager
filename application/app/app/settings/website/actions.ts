"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function updateWebsitePage(id: string, data: { title: string; body_json: any }) {
  const supabase = await createClient();

    const { data: updatedRows, error } = await supabase
      .from("website_pages")
      .update({
        title: data.title,
        body_json: data.body_json,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating website page:", error);
      return { error: error.message };
    }

    if (!updatedRows || updatedRows.length === 0) {
      console.error("Update succeeded but 0 rows were modified. RLS issue or incorrect ID:", id);
      return { error: "Update rejected by database (likely RLS policy violation or incorrect ID)." };
    }

  await logAction("update", "website_page", id, { title: data.title });

  // Log to check if we're actually receiving the nested data (like process_steps):
  console.log("Saving Website Page:", id, "title:", data.title);
  console.log("Keys in body_json:", Object.keys(data.body_json));
  if (data.body_json.process_steps) {
    console.log("process_steps length:", data.body_json.process_steps.length);
  }

  revalidatePath("/app/settings/website", "layout");
  revalidatePath("/", "layout");
  return { success: true };
}

import fs from "fs";
import path from "path";
import { processImage, deleteProcessedImage } from "@/lib/image-processor";

export async function getMediaLibrary() {
  const mediaPath = path.join(process.cwd(), "public", "cms-media", "original");
  
  try {
    if (!fs.existsSync(mediaPath)) {
      return { files: [] };
    }
    
    const files = fs.readdirSync(mediaPath);
    // Filter for common image extensions
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );
    
    return { files: imageFiles.sort() };
  } catch (error) {
    console.error("Error reading media library:", error);
    return { error: "Failed to read media library" };
  }
}

export async function uploadMedia(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    // Sanitize filename: replace spaces with hyphens, remove non-alphanumeric (except . and -)
    const sanitizedName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\.\-]/g, "");

    const result = await processImage(buffer, sanitizedName);
    
    await logAction("upload", "media", sanitizedName, { 
      originalWidth: result.originalWidth 
    });

    return { success: true, result };
  } catch (error: any) {
    console.error("Error uploading media:", error);
    return { error: error.message || "Failed to process image" };
  }
}

export async function deleteMedia(filename: string) {
  const supabase = await createClient();

  // 🚨 1. Safety Check: Is it used in any pages?
  // We fetch all pages and check their JSON content for the filename.
  // Since there are only a handful of pages, this is efficient and reliable.
  const { data: allPages, error: fetchError } = await supabase
    .from("website_pages")
    .select("title, body_json");

  if (fetchError) {
    console.error("Error fetching pages for media check:", fetchError);
    return { error: "Failed to check if image is in use." };
  }

  const usageCount = allPages?.filter(p => 
    JSON.stringify(p.body_json).includes(filename)
  );

  if (usageCount && usageCount.length > 0) {
    const pageTitles = usageCount.map(p => p.title).join(", ");
    return { 
      error: `Cannot delete image. It is currently in use on the following pages: ${pageTitles}. Please remove it from those pages first.` 
    };
  }

  // 🗑️ 2. Delete files
  try {
    await deleteProcessedImage(filename);
    await logAction("delete", "media", filename, {});
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting media files:", err);
    return { error: err.message || "Failed to delete files." };
  }
}

export async function swapMedia(oldFilename: string, newFilename: string) {
  const supabase = await createClient();

  // 1. Fetch all pages
  const { data: allPages, error: fetchError } = await supabase
    .from("website_pages")
    .select("id, title, body_json");

  if (fetchError) {
    console.error("Error fetching pages for swap:", fetchError);
    return { error: "Failed to fetch pages for asset replacement." };
  }

  const oldPath = `/cms-media/original/${oldFilename}`;
  const newPath = `/cms-media/original/${newFilename}`;

  let affectedCount = 0;

  for (const page of allPages) {
    const bodyStr = JSON.stringify(page.body_json);
    
    if (bodyStr.includes(oldFilename)) {
      // Per page replacement
      const newBodyStr = bodyStr.split(oldPath).join(newPath);
      const newBodyJson = JSON.parse(newBodyStr);

      const { error: updateError } = await supabase
        .from("website_pages")
        .update({ body_json: newBodyJson })
        .eq("id", page.id);

      if (updateError) {
        console.error(`Error updating page ${page.title} during swap:`, updateError);
        return { error: `Failed to update page: ${page.title}` };
      }
      
      affectedCount++;
    }
  }

  await logAction("swap", "media", oldFilename, { 
    replacedWith: newFilename,
    pagesAffected: affectedCount 
  });

  revalidatePath("/app/settings/website");
  revalidatePath("/");

  return { success: true, affectedCount };
}
