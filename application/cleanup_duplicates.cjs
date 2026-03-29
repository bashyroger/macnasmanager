require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We'll try user's anon key, shouldn't matter since RLS for admin might be fine, but if not we might fail.
// Wait the user might have RLS active. Is there a service role key? Let's check environment vars or just use the local client pattern.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching time entries...");
  const { data: entries, error } = await supabase
    .from("time_entries")
    .select("id, external_event_id")
    .not("external_event_id", "is", null) // Only check connected events
    .order("created_at", { ascending: true }); // Keep the oldest ones

  if (error) {
    console.error("Error fetching entries:", error);
    return;
  }

  const seenIds = new Set();
  const duplicateIds = [];

  for (const entry of entries) {
    if (seenIds.has(entry.external_event_id)) {
      duplicateIds.push(entry.id);
    } else {
      seenIds.add(entry.external_event_id);
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
