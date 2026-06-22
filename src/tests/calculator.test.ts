import {
  calculateBMI,
  calculateRecommendedCalories,
  calculateTargetDate,
  generateHealthAssessment,
  HealthInput,
} from "@/lib/health/calculator";
import { describe, expect, test } from "vitest";

const baseInput: HealthInput = {
  gender: "female",
  goal: "lose_weight",
  age: 26,
  height: 170,
  weight: 78,
  target_weight: 70,
  activity_level: "moderately_active",
  sleep_duration: "7_8",
  sleep_schedule: "regular",
  meal_regularity: "sometimes_irregular",
  eating_habit: "generally_balanced",
  stress_level: "moderate",
};

describe("health calculator", () => {
  test("calculates BMI correctly", () => {
    expect(calculateBMI(170, 78)).toBe(26.99);
  });

  test("throws error for invalid height", () => {
    expect(() => calculateBMI(0, 78)).toThrow(
      "Invalid height or weight"
    );
  });

  test("throws error for invalid weight", () => {
    expect(() => calculateBMI(170, -1)).toThrow(
      "Invalid height or weight"
    );
  });

  test("calculates recommended calories", () => {
    const calories =
      calculateRecommendedCalories(baseInput);

    expect(calories).toBeGreaterThan(1000);
    expect(calories).toBeLessThan(4000);
  });

  test("calculates target date for lose weight goal", () => {
    const targetDate =
      calculateTargetDate(baseInput);

    expect(targetDate).not.toBeNull();
  });

  test("generates full health assessment", () => {
    const result =
      generateHealthAssessment(baseInput);

    expect(result.bmi).toBe(26.99);
    expect(result.healthScore).toBeGreaterThan(0);
    expect(result.fullResult.forecastCurve.length).toBe(13);
    expect(result.fullResult.bmiCategory).toBe("Overweight");
  });
});