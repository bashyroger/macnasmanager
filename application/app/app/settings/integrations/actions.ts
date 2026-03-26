"use server";

import { generateAuthUrl } from "@/lib/google-calendar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function connectGoogleCalendar() {
  const url = generateAuthUrl();
  redirect(url);
}

export async function disconnectGoogleCalendar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) throw new Error("Not logged in");

  await supabase.from("google_tokens").delete().eq("user_id", data.user.id);
  // Optional: In a production app you'd also call google OAuth revokation endpoint.
  // We just delete our local reference here.
}
