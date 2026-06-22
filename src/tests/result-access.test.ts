import { describe, expect, test } from "vitest";

function getPublicResult(
  result: any,
  isPremium: boolean
) {
  if (!isPremium) {
    return {
      bmi: result.bmi,
      healthScore: result.health_score,
      recommendedCalories:
        result.recommended_calories,

      bmiCategory:
        result.full_result.bmiCategory,

      premiumLocked: true,
    };
  }

  return {
    ...result,
    premiumLocked: false,
  };
}

describe("premium gate", () => {

  const mockResult = {
    bmi: 26.99,

    health_score: 90,

    recommended_calories: 2405,

    target_date: "2026-09-13",

    full_result: {
      bmiCategory: "Overweight",

      forecastCurve: [
        {
          week: 1,
          weight: 77,
        },
      ],

      recommendations: [
        "test recommendation",
      ],
    },
  };

  test(
    "non premium users should not see premium data",
    () => {

      const result =
        getPublicResult(
          mockResult,
          false
        );

      expect(
        result.premiumLocked
      ).toBe(true);

      expect(
        (result as any).target_date
      ).toBeUndefined();

      expect(
        (result as any).forecastCurve
      ).toBeUndefined();
    }
  );

  test(
    "premium users should see full data",
    () => {

      const result =
        getPublicResult(
          mockResult,
          true
        );

      expect(
        result.premiumLocked
      ).toBe(false);

      expect(
        result.target_date
      ).toBe("2026-09-13");
    }
  );
});