"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export type UserRole = "owner_admin" | "editor";

export async function getUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, full_name, created_at, invited_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch team members." };
  }

  return { users: data };
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  const supabase = await createClient();

  // Prevent the current user from changing their own role
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === userId) {
    return { error: "You cannot change your own role." };
  }

  const { error } = await supabase
    .from("users")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return { error: error.message };
  }

  await logAction("update_role", "user", userId, { newRole });
  revalidatePath("/app/settings/team");
  return { success: true };
}

export async function inviteUser(email: string, role: UserRole) {
  // Use the service-role key to call admin APIs
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if user already exists
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", email)
    .single();

  if (existing) {
    return { error: `${email} is already a team member.` };
  }

  // Send the invite via Supabase Auth Admin
  const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "https://")}/app`,
  });

  if (inviteError) {
    console.error("Error inviting user:", inviteError);
    return { error: inviteError.message };
  }

  // Pre-insert the user row with their intended role so it's ready when they sign up
  const { error: insertError } = await supabaseAdmin
    .from("users")
    .insert({
      id: inviteData.user.id,
      email,
      role,
      invited_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error("Error pre-inserting invited user:", insertError);
    // Non-fatal — the invite email was still sent
  }

  await logAction("invite_user", "user", inviteData.user.id, { email, role });
  revalidatePath("/app/settings/team");
  return { success: true };
}
