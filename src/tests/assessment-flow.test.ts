import { describe, expect, test } from "vitest";
import {
  generateHealthAssessment,
  HealthInput,
} from "@/lib/health/calculator";

type MockSession = {
  id: string;
  currentStep: number;
  formData: Record<string, unknown>;
};

function saveProgress(
  session: MockSession,
  questionKey: string,
  answerValue: unknown,
  currentStep: number
) {
  return {
    ...session,
    currentStep,
    formData: {
      ...session.formData,
      [questionKey]: answerValue,
    },
  };
}

function recoverProgress(session: MockSession) {
  return {
    currentStep: session.currentStep,
    formData: session.formData,
  };
}

describe("assessment flow integration", () => {
  test("saves progress and recovers previously entered answers", () => {
    let session: MockSession = {
      id: "test-session",
      currentStep: 1,
      formData: {},
    };

    session = saveProgress(
      session,
      "gender",
      "female",
      1
    );

    session = saveProgress(
      session,
      "goal",
      "lose_weight",
      2
    );

    session = saveProgress(
      session,
      "sleep_duration",
      "7_8",
      3
    );

    const recovered = recoverProgress(session);

    expect(recovered.currentStep).toBe(3);
    expect(recovered.formData).toEqual({
      gender: "female",
      goal: "lose_weight",
      sleep_duration: "7_8",
    });
  });

  test("duplicate submission overwrites existing answer", () => {
    let session: MockSession = {
      id: "test-session",
      currentStep: 1,
      formData: {},
    };

    session = saveProgress(
      session,
      "gender",
      "male",
      1
    );

    session = saveProgress(
      session,
      "gender",
      "female",
      1
    );

    const recovered = recoverProgress(session);

    expect(recovered.formData.gender).toBe("female");
  });

  test("out-of-order submission still preserves data snapshot", () => {
    let session: MockSession = {
      id: "test-session",
      currentStep: 1,
      formData: {},
    };

    session = saveProgress(
      session,
      "weight",
      78,
      13
    );

    session = saveProgress(
      session,
      "gender",
      "female",
      1
    );

    session = saveProgress(
      session,
      "goal",
      "lose_weight",
      2
    );

    const recovered = recoverProgress(session);

    expect(recovered.formData.weight).toBe(78);
    expect(recovered.formData.gender).toBe("female");
    expect(recovered.formData.goal).toBe("lose_weight");
  });

  test("generates health assessment from recovered form data", () => {
    const recoveredFormData = {
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

    const input =
      recoveredFormData as HealthInput;

    const result =
      generateHealthAssessment(input);

    expect(result.bmi).toBe(26.99);
    expect(result.recommendedCalories).toBeGreaterThan(1000);
    expect(result.targetDate).not.toBeNull();
    expect(result.fullResult.forecastCurve.length).toBe(13);
  });
});