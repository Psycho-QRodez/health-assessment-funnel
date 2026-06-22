import { describe, expect, test } from "vitest";
import { ProgressSchema } from "@/lib/validation/progress";

const sessionId =
  "565d84b2-5bdc-472b-827a-4a25fd083080";

describe("progress validation", () => {
  test("accepts valid age", () => {
    const result = ProgressSchema.safeParse({
      sessionId,
      questionKey: "age",
      answerValue: 26,
      currentStep: 12,
    });

    expect(result.success).toBe(true);
  });

  test("rejects invalid age", () => {
    const result = ProgressSchema.safeParse({
      sessionId,
      questionKey: "age",
      answerValue: -10,
      currentStep: 12,
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid height", () => {
    const result = ProgressSchema.safeParse({
      sessionId,
      questionKey: "height",
      answerValue: 999,
      currentStep: 13,
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid weight", () => {
    const result = ProgressSchema.safeParse({
      sessionId,
      questionKey: "weight",
      answerValue: 0,
      currentStep: 14,
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = ProgressSchema.safeParse({
      sessionId,
      questionKey: "email",
      answerValue: "not-email",
      currentStep: 17,
    });

    expect(result.success).toBe(false);
  });

  test("rejects invalid goal enum", () => {
    const result = ProgressSchema.safeParse({
      sessionId,
      questionKey: "goal",
      answerValue: "random_goal",
      currentStep: 2,
    });

    expect(result.success).toBe(false);
  });
});