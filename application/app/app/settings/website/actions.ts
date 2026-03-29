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

import fs from "fs";
import path from "path";
import { processImage } from "@/lib/image-processor";

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
