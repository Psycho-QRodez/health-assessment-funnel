import { z } from "zod";

const baseProgressSchema = z.object({
  sessionId: z.uuid(),

  questionKey: z.string().min(1),

  answerValue: z.any(),

  currentStep: z.number().int().positive(),
});

function validateAnswerByQuestion(
  questionKey: string,
  answerValue: unknown
) {
  switch (questionKey) {
    case "age":
      return z
        .number()
        .int()
        .min(13)
        .max(100)
        .safeParse(answerValue);

    case "height":
      return z
        .number()
        .min(100)
        .max(250)
        .safeParse(answerValue);

    case "weight":
      return z
        .number()
        .min(30)
        .max(300)
        .safeParse(answerValue);

    case "target_weight":
      return z
        .number()
        .min(30)
        .max(300)
        .safeParse(answerValue);

    case "email":
      return z
        .email()
        .safeParse(answerValue);

    case "name":
      return z
        .string()
        .min(1)
        .max(80)
        .safeParse(answerValue);

    case "gender":
      return z
        .enum(["male", "female"])
        .safeParse(answerValue);

    case "goal":
      return z
        .enum([
          "lose_weight",
          "maintain_weight",
          "build_muscle",
          "improve_body_shape",
          "mobility",
        ])
        .safeParse(answerValue);

    case "activity_level":
      return z
        .enum([
          "mostly_sitting",
          "lightly_active",
          "moderately_active",
          "very_active",
        ])
        .safeParse(answerValue);

    case "sleep_duration":
      return z
        .enum([
          "less_than_5",
          "5_6",
          "7_8",
          "more_than_8",
        ])
        .safeParse(answerValue);

    case "sleep_schedule":
    case "meal_regularity":
      return z
        .enum([
          "regular",
          "sometimes_irregular",
          "highly_irregular",
        ])
        .safeParse(answerValue);

    case "eating_habit":
      return z
        .enum([
          "mostly_healthy_balanced",
          "generally_balanced",
          "frequent_takeout",
          "high_sugar_high_fat",
        ])
        .safeParse(answerValue);

    case "stress_level":
      return z
        .enum([
          "low",
          "moderate",
          "high",
          "very_high",
        ])
        .safeParse(answerValue);

    case "workout_type":
      return z
        .array(
          z.enum([
            "no_workout",
            "strength_training",
            "cardio",
            "sports",
            "mixed_activities",
            "yoga",
            "pilates",
            "stretching",
            "not_sure_yet",
          ])
        )
        .min(1)
        .safeParse(answerValue);

    case "workout_frequency":
      return z
        .enum([
          "every_day",
          "3_5_per_week",
          "1_2_per_week",
          "few_per_month",
          "no_fixed_routine",
        ])
        .safeParse(answerValue);

    case "mobility_experience":
      return z
        .enum([
          "never_tried",
          "beginner",
          "intermediate",
          "advanced",
        ])
        .safeParse(answerValue);

    default:
      return z.any().safeParse(answerValue);
  }
}

export const ProgressSchema =
  baseProgressSchema.superRefine((data, ctx) => {
    const result = validateAnswerByQuestion(
      data.questionKey,
      data.answerValue
    );

    if (!result.success) {
      ctx.addIssue({
        code: "custom",
        path: ["answerValue"],
        message: `Invalid answerValue for questionKey: ${data.questionKey}`,
      });
    }
  });