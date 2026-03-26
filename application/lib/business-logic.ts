/**
 * Deterministic Business Logic for Studio Macnas
 * This file contains pure functions for financial and sustainability calculations.
 * They are designed to be testable without database or environment dependencies.
 */

// BR-001: Duration calculation (ceil in minutes)
export function calculateDurationMinutes(startTime: string | Date, endTime: string | Date): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  return Math.ceil((end - start) / 60000);
}

// BR-002: Material line cost
export function calculateMaterialLineCost(quantity: number, unitCost: number): number {
  return Math.round(quantity * unitCost * 100) / 100;
}

// BR-003: Labor cost
export function calculateLaborCost(durationMinutes: number, hourlyRate: number): number {
  return Math.round((durationMinutes / 60) * hourlyRate * 100) / 100;
}

// BR-008, 010: Sustainability scoring
export type ProjectMaterialRecord = {
  material_id: string;
  quantity_used: number;
};

export type MaterialScoreRecord = {
  material_id: string;
  sustainability_axis_id: string;
  score: number;
};

export type SustainabilityAxisRecord = {
  id: string;
  name: string;
  weight: number;
  grade_a_min: number;
  grade_b_min: number;
  grade_c_min: number;
};

export function calculateAxisScore(
  projectMaterials: ProjectMaterialRecord[],
  materialScores: MaterialScoreRecord[],
  axisId: string
): number {
  const totalQuantity = projectMaterials.reduce((sum, pm) => sum + pm.quantity_used, 0);
  if (totalQuantity === 0) return 0;

  let accumulator = 0;
  for (const pm of projectMaterials) {
    const mScore = materialScores.find(
      (s) => s.material_id === pm.material_id && s.sustainability_axis_id === axisId
    );
    if (mScore) {
      const normalizedWeight = pm.quantity_used / totalQuantity;
      accumulator += mScore.score * normalizedWeight;
    }
  }

  return Math.round(accumulator * 10) / 10;
}

export function determineLetterGrade(score: number, axis: SustainabilityAxisRecord): string {
  if (score >= axis.grade_a_min) return "A";
  if (score >= axis.grade_b_min) return "B";
  if (score >= axis.grade_c_min) return "C";
  return "D";
}

export function calculateOverallSustainabilityScore(
  axisResults: { score: number; weight: number }[]
): number {
  const totalWeight = axisResults.reduce((sum, a) => sum + a.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = axisResults.reduce((sum, a) => sum + a.score * a.weight, 0);
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}

// BR-011: Product Tier Assignment
export type TierRecord = {
  id: string;
  code: string;
  label: string;
  min_total_cost: number | null;
  min_labor_hours: number | null;
  rule_json: any | null;
  is_active: boolean;
};

export function evaluateTier(
  totalCost: number,
  laborMinutes: number,
  activeTiers: TierRecord[]
): { id: string; code: string; label: string } | null {
  const laborHours = laborMinutes / 60;

  for (const tier of activeTiers) {
    let matches = true;

    if (tier.min_total_cost !== null && totalCost < tier.min_total_cost) {
      matches = false;
    }
    
    if (tier.min_labor_hours !== null && laborHours < tier.min_labor_hours) {
      matches = false;
    }

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

  return null;
}
