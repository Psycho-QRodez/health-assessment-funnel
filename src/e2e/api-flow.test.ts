import { describe, expect, test } from "vitest";

const BASE_URL =
  process.env.E2E_BASE_URL || "http://localhost:3000";

async function postJson(
  path: string,
  body: Record<string, unknown>
) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

async function getJson(path: string) {
  const response = await fetch(`${BASE_URL}${path}`);

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

describe("API E2E flow", () => {
  test(
    "user can complete assessment, see locked result, pay, and unlock full result",
    async () => {
      const start = await postJson(
        "/api/session/start",
        {}
      );

      expect(start.status).toBe(200);
      expect(start.data.success).toBe(true);
      expect(start.data.sessionId).toBeTruthy();

      const sessionId = start.data.sessionId;

      const answers = [
        {
          questionKey: "gender",
          answerValue: "female",
          currentStep: 1,
        },
        {
          questionKey: "goal",
          answerValue: "lose_weight",
          currentStep: 2,
        },
        {
          questionKey: "sleep_duration",
          answerValue: "7_8",
          currentStep: 3,
        },
        {
          questionKey: "sleep_schedule",
          answerValue: "regular",
          currentStep: 4,
        },
        {
          questionKey: "meal_regularity",
          answerValue: "sometimes_irregular",
          currentStep: 5,
        },
        {
          questionKey: "eating_habit",
          answerValue: "generally_balanced",
          currentStep: 6,
        },
        {
          questionKey: "stress_level",
          answerValue: "moderate",
          currentStep: 7,
        },
        {
          questionKey: "activity_level",
          answerValue: "moderately_active",
          currentStep: 8,
        },
        {
          questionKey: "age",
          answerValue: 26,
          currentStep: 12,
        },
        {
          questionKey: "height",
          answerValue: 170,
          currentStep: 13,
        },
        {
          questionKey: "weight",
          answerValue: 78,
          currentStep: 14,
        },
        {
          questionKey: "target_weight",
          answerValue: 70,
          currentStep: 15,
        },
      ];

      for (const answer of answers) {
        const saved = await postJson(
          "/api/progress/save",
          {
            sessionId,
            ...answer,
          }
        );

        expect(saved.status).toBe(200);
        expect(saved.data.success).toBe(true);
      }

      const generated = await postJson(
        "/api/results/generate",
        {
          sessionId,
        }
      );

      expect(generated.status).toBe(200);
      expect(generated.data.success).toBe(true);
      expect(generated.data.result.bmi).toBe(26.99);

      const locked = await getJson(
        `/api/results?sessionId=${sessionId}`
      );

      expect(locked.status).toBe(200);
      expect(locked.data.success).toBe(true);
      expect(locked.data.premiumLocked).toBe(true);

      expect(
        locked.data.result.forecastCurve
      ).toBeUndefined();

      const paid = await postJson("/api/pay", {
        sessionId,
      });

      expect(paid.status).toBe(200);
      expect(paid.data.success).toBe(true);

      const unlocked = await getJson(
        `/api/results?sessionId=${sessionId}`
      );

      expect(unlocked.status).toBe(200);
      expect(unlocked.data.success).toBe(true);
      expect(unlocked.data.premiumLocked).toBe(false);

      expect(
        unlocked.data.result.forecastCurve
      ).toBeDefined();

      expect(
        unlocked.data.result.recommendations
      ).toBeDefined();

      expect(
        unlocked.data.result.targetDate
      ).toBeDefined();
    },
    30000
  );
});