import { createClient } from "@/lib/supabase/server";

export async function logAction(
  action: string, 
  entity_type: string, 
  entity_id?: string, 
  details?: any
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("audit_logs").insert({
      user_id: user?.id,
      action,
      entity_type,
      entity_id,
      details
    });
    
    if (error) {
      console.error("Failed to log audit action:", error);
    }
  } catch (err) {
    console.error("Error in logAction:", err);
  }
}
