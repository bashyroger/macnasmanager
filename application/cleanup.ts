import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Read .env.local manually
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching time entries...");
  const { data: entries, error } = await supabase
    .from("time_entries")
    .select("id, external_event_id")
    .not("external_event_id", "is", null)
    .order("created_at", { ascending: true }); // Keep the oldest ones

  if (error) {
    console.error("Error fetching entries:", error);
    return;
  }

  const seenIds = new Set();
  const duplicateIds = [];

  if (entries) {
    for (const entry of entries) {
      if (seenIds.has(entry.external_event_id)) {
        duplicateIds.push(entry.id);
      } else {
        seenIds.add(entry.external_event_id);
      }
    }
  }

  console.log(`Found ${duplicateIds.length} duplicates to delete.`);

  if (duplicateIds.length > 0) {
    for (const id of duplicateIds) {
      const { error: delErr } = await supabase
        .from("time_entries")
        .delete()
        .eq("id", id);
      if (delErr) {
        console.error("Failed to delete duplicate:", id, delErr);
      } else {
        console.log("Deleted duplicate:", id);
      }
    }
  }
  console.log("Cleanup complete.");
}

run();
