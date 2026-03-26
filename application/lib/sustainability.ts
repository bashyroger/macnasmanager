import { createClient } from "./supabase/server";

export type SustainabilityResult = {
  isComplete: boolean;
  overallScore?: number;
  axes?: {
    axisId: string;
    name: string;
    score: number;
    letterGrade: string;
  }[];
  missingScores?: { materialName: string; axisName: string }[];
  radarChartPayload?: any;
};

export async function computeProjectSustainability(projectId: string): Promise<SustainabilityResult> {
  const supabase = await createClient();

  // 1. Fetch active axes
  const responseAxes = await supabase
    .from("sustainability_axes")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  const axes = responseAxes.data as any[] | null;

  if (!axes || axes.length === 0) {
    return { isComplete: true, overallScore: 0, axes: [], radarChartPayload: [] };
  }

  // 2. Fetch project materials
  const responsePM = await supabase
    .from("project_materials")
    .select(`
      id, 
      material_id, 
      quantity_used,
      materials ( name )
    `)
    .eq("project_id", projectId);
  const projectMaterials = responsePM.data as any[] | null;

  if (!projectMaterials || projectMaterials.length === 0) {
    // If no materials, it's basically N/A
    return { isComplete: true, overallScore: 0, axes: axes.map(a => ({ axisId: a.id, name: a.name, score: 0, letterGrade: "N/A" })), radarChartPayload: [] };
  }

  const totalQuantity = projectMaterials.reduce((sum: number, pm: any) => sum + pm.quantity_used, 0);

  // 3. Fetch material scores for these materials
  const materialIds = projectMaterials.map((pm: any) => pm.material_id);
  const responseScores = await supabase
    .from("material_sustainability_scores")
    .select("material_id, sustainability_axis_id, score")
    .in("material_id", materialIds);
  const scores = responseScores.data as any[] | null;

  const missingScores: { materialName: string; axisName: string }[] = [];
  const axisResults = [];

  // 4. Calculate score per axis
  for (const axis of axes) {
    let axisAccumulator = 0;
    
    for (const pm of projectMaterials) {
      const pmScore = scores?.find((s: any) => s.material_id === pm.material_id && s.sustainability_axis_id === axis.id);
      
      if (!pmScore) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        missingScores.push({ materialName: (pm.materials as any)?.name ?? "Unknown material", axisName: axis.name });
      } else {
        const normalizedWeight = totalQuantity > 0 ? pm.quantity_used / totalQuantity : 0;
        axisAccumulator += pmScore.score * normalizedWeight;
      }
    }

    // Determine letter grade
    let letterGrade = "D";
    if (axisAccumulator >= axis.grade_a_min) {
      letterGrade = "A";
    } else if (axisAccumulator >= axis.grade_b_min) {
      letterGrade = "B";
    } else if (axisAccumulator >= axis.grade_c_min) {
      letterGrade = "C";
    }

    axisResults.push({
      axisId: axis.id,
      name: axis.name,
      score: Math.round(axisAccumulator * 10) / 10,
      weight: axis.weight,
      letterGrade,
      fullMark: 100
    });
  }

  if (missingScores.length > 0) {
    return { isComplete: false, missingScores };
  }

  // 5. Overall Score (weighted average)
  const totalWeight = axisResults.reduce((sum, a) => sum + a.weight, 0);
  let overallScore = 0;
  if (totalWeight > 0) {
    overallScore = axisResults.reduce((sum, a) => sum + (a.score * a.weight), 0) / totalWeight;
  }

  // 6. Build Radar Chart Payload
  const radarChartPayload = axisResults.map(a => ({
    subject: a.name,
    A: a.score,
    fullMark: 100
  }));

  return {
    isComplete: true,
    overallScore: Math.round(overallScore * 10) / 10,
    axes: axisResults.map(a => ({
      axisId: a.axisId,
      name: a.name,
      score: a.score,
      letterGrade: a.letterGrade
    })),
    radarChartPayload
  };
}
