import { NextResponse } from "next/server";
import { getGoogleOAuthClient } from "@/lib/google-calendar";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import type { Database } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic"; // Ensure cron job is never cached

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Use service role key because this is a background job without a user session
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  try {
    const result = await import("@/lib/google-calendar").then(m => m.syncCalendarEvents(supabase));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
