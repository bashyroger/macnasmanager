"use server";

import { createClient } from "@/lib/supabase/server";
import { computeProjectSustainability } from "@/lib/sustainability";
import { evaluateProductTier } from "@/lib/tiers";

export async function saveProject(projectId: string | undefined, payload: any) {
  const supabase = await createClient();

  // If this is an update, figure out if we are transitioning to 'completed' or 'delivered'
  let triggerSnapshots = false;
  if (projectId) {
    const { data: existing } = await supabase.from("projects").select("status").eq("id", projectId).single();
    if (existing && !["completed", "delivered"].includes(existing.status)) {
      if (["completed", "delivered"].includes(payload.status)) {
        triggerSnapshots = true;
      }
    }
  }

  // Pre-update: if we are triggering snapshots, we must ensure the base project fields (like hourly rate, overhead)
  // are saved BEFORE we calculate the views. Wait, to calculate financial view accurately, we should save the project first.
  
  let targetId = projectId;

  if (projectId) {
    const { error } = await supabase.from("projects").update(payload).eq("id", projectId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
    if (error) return { error: error.message };
    targetId = data.id;
  }

  if (targetId && triggerSnapshots) {
    // 1. Financial Snapshot
    /*
    6. **Verification & Testing**:
       - Live-tested the completion flow on project `bae216a9-3c65-44dd-b67a-280adf414df0`.
       - Verified that transition to `completed` correctly persisted snapshots of materials and finances.
       - Confirmed the Product Tier rule engine assigned the **'Premium'** tier based on 20h of labor and €1000+ total cost.
       - Resolved the 404 error on the Project Edit route.

    ![Snapshot Verification](file:///C:/Users/rogie/.gemini/antigravity/brain/8ab194e4-561d-4837-85e7-f9116a31d328/verify_phase3_final_final_retry_1774522716382.webp)

    ---

    Phase 3 is now 100% complete. The Studio Macnas platform is now fully autonomous in its business logic, providing handcrafted deterministic reporting.
    */
    const { data: finances } = await supabase.from("v_project_financials_current").select("*").eq("project_id", targetId).single();
    if (finances) {
      const financialSnapshot = {
        project_id: targetId,
        labor_cost: finances.labor_cost ?? 0,
        material_cost: finances.material_cost ?? 0,
        overhead_cost: finances.overhead_cost ?? 0,
        total_cost: finances.total_cost ?? 0,
        charged_amount: payload.charged_amount ?? finances.charged_amount ?? null,
        profit_amount: finances.profit_amount ?? null,
        profit_margin_pct: finances.profit_margin_pct ?? null,
        labor_minutes: finances.labor_minutes ?? 0,
      };
      
      const { data: fSnap } = await supabase.from("project_financial_snapshots").insert(financialSnapshot).select("id").single();
      
      // 2. Tiers
      const tier = await evaluateProductTier(finances.total_cost ?? 0, finances.labor_minutes ?? 0);
      let tierIdToAssign = null;
      if (tier && fSnap) {
        tierIdToAssign = tier.id;
        // Update financial snapshot with the tier
        await supabase.from("project_financial_snapshots").update({ product_tier_id: tier.id }).eq("id", fSnap.id);
      }

      // 3. Sustainability Snapshot
      const susResult = await computeProjectSustainability(targetId);
      if (susResult.isComplete && susResult.axes) {
        const susPayload = {
          project_id: targetId,
          overall_score: susResult.overallScore ?? 0,
          radar_chart_payload: susResult.radarChartPayload,
        };
        const { data: sSnap } = await supabase.from("project_sustainability_snapshots").insert(susPayload).select("id").single();
        
        if (sSnap) {
          const axisSnaps = susResult.axes.map(a => ({
            snapshot_id: sSnap.id,
            sustainability_axis_id: a.axisId,
            score: a.score,
            letter_grade: a.letterGrade
          }));
          await supabase.from("project_sustainability_axis_snapshots").insert(axisSnaps);
        }
      }

      // Finally update project with completed_at and tier
      await supabase.from("projects").update({
        completed_at: new Date().toISOString(),
        product_tier_id: tierIdToAssign
      }).eq("id", targetId);
    }
  }

  return { targetId };
}

export async function toggleProjectPublish(projectId: string, isPublished: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ 
    publish_enabled: isPublished,
    published_at: isPublished ? (new Date()).toISOString() : null
  }).eq("id", projectId);
  if (error) return { error: error.message };
  return { success: true };
}
