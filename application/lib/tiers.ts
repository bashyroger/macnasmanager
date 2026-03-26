import { createClient } from "./supabase/server";
import { evaluateTier, TierRecord } from "./business-logic";

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
  const tiers = responseTiers.data as TierRecord[] | null;

  if (!tiers || tiers.length === 0) return null;

  return evaluateTier(totalCost, laborMinutes, tiers);
}
