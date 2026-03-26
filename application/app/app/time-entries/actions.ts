"use server";

import { createClient } from "@/lib/supabase/server";
import { createCalendarEvent } from "@/lib/google-calendar";

type LogTimePayload = {
  title: string;
  projectId: string | null;
  startTime: string; // ISO
  endTime: string;   // ISO
  durationMinutes: number;
};

export async function logTimeManualEntry(payload: LogTimePayload) {
  const supabase = await createClient();

  // 1. Get the admin's google token if available
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not logged in");

  const { data: tokens } = await supabase
    .from("google_tokens")
    .select("refresh_token")
    .eq("user_id", userData.user.id)
    .single();

  // 2. Insert the time entry into Supabase
  const insertPayload: any = {
    title: payload.title,
    project_id: payload.projectId || null,
    start_time: payload.startTime,
    end_time: payload.endTime,
    duration_minutes: payload.durationMinutes,
    source: "manual",
    needs_manual_assignment: !payload.projectId,
  };

  const { data: entry, error: dbError } = await supabase
    .from("time_entries")
    .insert(insertPayload)
    .select("id")
    .single();

  if (dbError) throw new Error(dbError.message);

  // 3. If we have a Google Calendar connection, push the event asynchronously
  if (tokens?.refresh_token) {
    try {
      // Best-effort push; we don't fail the insert if calendar fails
      let eventTitle = payload.title;

      // If assigning to a project, format the title nicely
      if (payload.projectId) {
        const { data: proj } = await supabase
          .from("projects")
          .select("title")
          .eq("id", payload.projectId)
          .single();
        if (proj) {
          eventTitle = `${eventTitle} [Macnas: ${proj.title}]`;
        }
      }

      await createCalendarEvent(tokens.refresh_token, {
        summary: eventTitle,
        startTime: payload.startTime,
        endTime: payload.endTime,
        description: `Source: Studio Macnas Dashboard\nTime Entry ID: ${entry.id}`,
      });
      
    } catch (calError: any) {
      console.error("Failed to push event to Google Calendar:", calError);
      // We log it but do not crash the user's manual entry creation
    }
  }

  return { success: true };
}

export async function triggerManualCalendarSync() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not logged in");

  try {
    const { syncCalendarEvents } = await import("@/lib/google-calendar");
    const result = await syncCalendarEvents(supabase);
    return result;
  } catch (error: any) {
    console.error("Manual sync failed:", error);
    throw new Error(error.message || "Manual sync failed");
  }
}
