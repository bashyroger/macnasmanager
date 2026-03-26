import { createClient } from "./supabase/server";

export async function evaluateProductTier(
  totalCost: number,
  laborMinutes: number
): Promise<{ id: string; code: string; label: string } | null> {
  const supabase = await createClient();

  const responseTiers = await supabase
    .from("product_tiers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  const tiers = responseTiers.data as any[] | null;

  if (!tiers || tiers.length === 0) return null;

  const laborHours = laborMinutes / 60;

  for (const tier of tiers) {
    let matches = true;

    if (tier.min_total_cost !== null && totalCost < tier.min_total_cost) {
      matches = false;
    }
    
    if (tier.min_labor_hours !== null && laborHours < tier.min_labor_hours) {
      matches = false;
    }

    // For rule_json, we can implement basic evaluation if it exists.
    // Example: { "conditions": [{ "field": "total_cost", "operator": ">=", "value": 5000 }] }
    // As per BR-015, simple explicit rule evaluation.
    if (matches && tier.rule_json && typeof tier.rule_json === "object") {
      const json = tier.rule_json as any;
      if (Array.isArray(json.conditions)) {
        for (const cond of json.conditions) {
          if (cond.field === "total_cost" && cond.operator === ">=" && totalCost < cond.value) matches = false;
          if (cond.field === "total_cost" && cond.operator === "<" && totalCost >= cond.value) matches = false;
          if (cond.field === "labor_hours" && cond.operator === ">=" && laborHours < cond.value) matches = false;
          if (cond.field === "labor_hours" && cond.operator === "<" && laborHours >= cond.value) matches = false;
        }
      }
    }

    if (matches) {
      return { id: tier.id, code: tier.code, label: tier.label };
    }
  }

  return null; // No tier matched (should usually have a catch-all tier at the end)
}
