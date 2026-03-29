import { google } from "googleapis";

// Ensure environment variables are correctly loaded
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// The callback URL MUST EXACTLY match what's configured in Google Cloud Console
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;

export function getGoogleOAuthClient() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing Google Cloud credentials in environment variables.");
  }

  return new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
}

export function generateAuthUrl() {
  const oauth2Client = getGoogleOAuthClient();
  
  // Generate a url that asks permissions for Google Calendar scopes
  return oauth2Client.generateAuthUrl({
    // 'offline' gets refresh_token
    access_type: "offline",
    // We strictly need calendar events to read/write time entries
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    // Force prompt ensures we always get a refresh token during connection
    prompt: "consent"
  });
}

export async function createCalendarEvent(
  refreshToken: string,
  event: {
    summary: string;
    description?: string;
    startTime: string; // ISO String
    endTime: string;   // ISO String
  }
) {
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.summary,
      description: event.description || "Created via Studio Macnas Manager",
      start: { dateTime: event.startTime },
      end: { dateTime: event.endTime },
    },
  });

  return response.data;
}

export async function deleteCalendarEvent(
  refreshToken: string,
  eventId: string
) {
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  await calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });

  return { success: true };
}

async function pushManualEntriesToCalendar(supabase: any, refreshToken: string) {
  // 1. Fetch all manual entries without external_event_id
  const { data: manualEntries } = await supabase
    .from("time_entries")
    .select("id, title, start_time, end_time, projects(short_code, title)")
    .eq("source", "manual")
    .is("external_event_id", null);

  if (!manualEntries || manualEntries.length === 0) return 0;

  let pushedCount = 0;

  // 2. Push each to Google Calendar
  for (const entry of manualEntries) {
    let description = "Created via Studio Macnas Manager";
    
    // Typecast to handle exact Supabase relationship shapes
    const project = (Array.isArray(entry.projects) ? entry.projects[0] : entry.projects) as any;
    
    if (project) {
       description = `Project: ${project.title}`;
       if (project.short_code) {
         description += `\nCode: ${project.short_code}`;
       }
    }

    try {
      const gEvent = await createCalendarEvent(refreshToken, {
        summary: entry.title,
        description,
        startTime: entry.start_time,
        endTime: entry.end_time
      });

      // 3. Update Supabase with the new Google Event ID
      // We change source to google_calendar to integrate tightly with the sync engine
      if (gEvent && gEvent.id) {
        await supabase
          .from("time_entries")
          .update({
            external_event_id: gEvent.id,
            source: "google_calendar"
          })
          .eq("id", entry.id);
        
        pushedCount++;
      }
    } catch (e) {
      console.error("Failed to push manual entry to Google Calendar", entry.id, e);
    }
  }
  return pushedCount;
}
export async function syncCalendarEvents(supabase: any) {
  let syncRunId: string | null = null;
  let recordsProcessed = 0;

  try {
    // 1. Start tracking the sync run
    const { data: runStart } = await supabase
      .from("sync_runs")
      .insert({ 
        sync_type: "google_calendar_import", 
        status: "running", 
        started_at: new Date().toISOString(), 
        summary_json: {} 
      })
      .select("id")
      .single();
    
    syncRunId = runStart?.id ?? null;

    // 2. Fetch the admin user's Google Token
    // In MVP, we just grab the first token we find since it's a single-tenant admin app.
    const { data: tokenRecord } = await supabase
      .from("google_tokens")
      .select("refresh_token")
      .limit(1)
      .single();

    if (!tokenRecord?.refresh_token) {
      throw new Error("No Google Calendar connected. Skipping sync.");
    }

    // Bidirectional Integration: Push un-synced manual entries UP first
    await pushManualEntriesToCalendar(supabase, tokenRecord.refresh_token);

    const oauth2Client = getGoogleOAuthClient();
    oauth2Client.setCredentials({ refresh_token: tokenRecord.refresh_token });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // 3. Determine time window
    // We fetch events modified in the last 24 hours for manual sync to be more thorough,
    // but the cron can stay frequent. Let's stick to 1 hour or make it a param? 
    // Let's do 24 hours for manual safety.
    const lookbackHours = 24;
    const sinceTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString();

    const response = await calendar.events.list({
      calendarId: "primary",
      updatedMin: sinceTime,
      singleEvents: true,
      orderBy: "startTime",
      showDeleted: true,
    });

    const events = response.data.items || [];
    
    const { data: projects } = await supabase.from("projects").select("id, title, short_code");

    // "Ghost Prevention": fetch all events the user specifically deleted locally but kept in Google
    const { data: ignoredRecords } = await (supabase.from("ignored_google_events") as any).select("external_event_id");
    const ignoredEventIds = new Set<string>();
    ignoredRecords?.forEach((r: any) => { if (r.external_event_id) ignoredEventIds.add(r.external_event_id); });

    // 4. Upsert/Delete events into time_entries
    for (const event of events) {
      if (!event.id || ignoredEventIds.has(event.id)) {
        continue;
      }

      if (event.status === "cancelled") {
        await supabase
          .from("time_entries")
          .delete()
          .eq("external_event_id", event.id);
        recordsProcessed++;
        continue;
      }

      if (!event.start?.dateTime || !event.end?.dateTime) continue; // Skip all-day events

      const durationMs = new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime();
      const durationMinutes = Math.ceil(durationMs / 60000);

      // Enhanced Matching: Check Title and Short Code
      let assignedProjectId: string | null = null;
      let needsManualAssignment = true;

      if (projects && event.summary) {
        const matchingProject = projects.find((p: any) => {
          const summaryLower = event.summary?.toLowerCase() || "";
          const descriptionLower = event.description?.toLowerCase() || "";
          
          const titleMatch = summaryLower.includes(p.title.toLowerCase()) || 
                             descriptionLower.includes(p.title.toLowerCase());
                             
          const codeMatch = p.short_code && (
                             summaryLower.includes(p.short_code.toLowerCase()) || 
                             descriptionLower.includes(p.short_code.toLowerCase())
                           );
                           
          return titleMatch || codeMatch;
        });
        
        if (matchingProject) {
          assignedProjectId = matchingProject.id;
          needsManualAssignment = false;
        }
      }

      const upsertPayload = {
        title: event.summary || "Untitled Calendar Event",
        start_time: event.start.dateTime,
        end_time: event.end.dateTime,
        duration_minutes: durationMinutes,
        source: "google_calendar",
        project_id: assignedProjectId,
        needs_manual_assignment: needsManualAssignment,
        external_event_id: event.id // Our unique key
      };

      // Check if event already exists
      const { data: existingEntry } = await supabase
        .from("time_entries")
        .select("id, needs_manual_assignment, project_id")
        .eq("external_event_id", event.id)
        .limit(1)
        .single();

      if (existingEntry) {
        const updatePayload = { ...upsertPayload };

        // PRESERVATION SAFEGUARD: 
        // If the user has already manually assigned this entry to a project inside Macnasmanager,
        // we must NOT allow the automated sync to forcefully unassign it.
        if (existingEntry.needs_manual_assignment === false) {
          updatePayload.project_id = existingEntry.project_id;
          updatePayload.needs_manual_assignment = false;
        }

        await supabase
          .from("time_entries")
          .update(updatePayload)
          .eq("id", existingEntry.id);
      } else {
        await supabase
          .from("time_entries")
          .insert(upsertPayload);
      }

      recordsProcessed++;
    }

    // Mark as success
    if (syncRunId) {
      await supabase.from("sync_runs").update({
        status: "success",
        summary_json: { records_processed: recordsProcessed },
        finished_at: new Date().toISOString()
      }).eq("id", syncRunId);
    }
    return { success: true, recordsProcessed };
  } catch (error: any) {
    console.error("Calendar Sync Error:", error);

    // Mark as failure
    if (syncRunId) {
      await supabase.from("sync_runs").update({
        status: "failed",
        summary_json: { error_details: error.message || String(error) },
        finished_at: new Date().toISOString()
      }).eq("id", syncRunId);
    }

    throw error;
  }
}

