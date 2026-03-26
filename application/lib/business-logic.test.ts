import { describe, it, expect } from "vitest";
import {
  calculateDurationMinutes,
  calculateMaterialLineCost,
  calculateLaborCost,
  calculateAxisScore,
  determineLetterGrade,
  calculateOverallSustainabilityScore,
  evaluateTier,
  TierRecord
} from "./business-logic";

describe("Studio Macnas Business Logic", () => {
  describe("Duration calculation (BR-001)", () => {
    it("calculates ceiling minutes correctly", () => {
      const start = "2024-01-01T10:00:00Z";
      const end = "2024-01-01T10:15:30Z"; // 15m 30s
      expect(calculateDurationMinutes(start, end)).toBe(16);
    });

    it("returns 0 for invalid range", () => {
      expect(calculateDurationMinutes("2024-01-01T10:00:00Z", "2024-01-01T09:00:00Z")).toBe(0);
    });
  });

  describe("Material costs (BR-002)", () => {
    it("calculates cost and rounds to 2 decimals", () => {
      expect(calculateMaterialLineCost(2.5, 12.333)).toBe(30.83);
      expect(calculateMaterialLineCost(10, 5.95)).toBe(59.5);
    });
  });

  describe("Labor costs (BR-003)", () => {
    it("calculates labor cost correctly", () => {
      expect(calculateLaborCost(90, 40)).toBe(60); // 1.5h * 40
      expect(calculateLaborCost(45, 100)).toBe(75); // 0.75h * 100
    });
  });

  describe("Sustainability scoring (BR-008, BR-010)", () => {
    const mockMaterials = [
      { material_id: "m1", quantity_used: 10 },
      { material_id: "m2", quantity_used: 20 },
    ];
    const mockScores = [
      { material_id: "m1", sustainability_axis_id: "a1", score: 80 },
      { material_id: "m2", sustainability_axis_id: "a1", score: 50 },
    ];
    const mockAxis = {
      id: "a1",
      name: "Carbon",
      weight: 1,
      grade_a_min: 75,
      grade_b_min: 50,
      grade_c_min: 25,
    };

    it("calculates weighted axis score correctly", () => {
      // (80 * 10/30) + (50 * 20/30) = 26.66 + 33.33 = 60
      expect(calculateAxisScore(mockMaterials, mockScores, "a1")).toBe(60);
    });

    it("determines correct letter grade", () => {
      expect(determineLetterGrade(80, mockAxis)).toBe("A");
      expect(determineLetterGrade(60, mockAxis)).toBe("B");
      expect(determineLetterGrade(30, mockAxis)).toBe("C");
      expect(determineLetterGrade(10, mockAxis)).toBe("D");
    });

    it("calculates overall weighted sum correctly", () => {
      const axisResults = [
        { score: 80, weight: 2 },
        { score: 50, weight: 1 },
      ];
      // (80*2 + 50*1) / 3 = 210 / 3 = 70
      expect(calculateOverallSustainabilityScore(axisResults)).toBe(70);
    });
  });

  describe("Product tiering (BR-011)", () => {
    const mockTiers: TierRecord[] = [
      {
        id: "t1",
        code: "PREM",
        label: "Premium",
        min_total_cost: 5000,
        min_labor_hours: 40,
        is_active: true,
        rule_json: null
      },
      {
        id: "t2",
        code: "MID",
        label: "Mid Range",
        min_total_cost: 1000,
        min_labor_hours: 10,
        is_active: true,
        rule_json: { conditions: [{ field: "total_cost", operator: ">=", value: 2000 }] }
      }
    ];

    it("matches premium tier correctly", () => {
      expect(evaluateTier(6000, 3000, mockTiers)?.code).toBe("PREM"); // 50h labor
    });

    it("matches mid tier by JSON rule", () => {
      expect(evaluateTier(2500, 1000, mockTiers)?.code).toBe("MID");
    });

    it("fails to match if thresholds not met", () => {
      expect(evaluateTier(500, 100, mockTiers)).toBe(null);
    });
  });
});
