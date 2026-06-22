export type Gender = "male" | "female";

export type Goal =
  | "lose_weight"
  | "maintain_weight"
  | "build_muscle"
  | "improve_body_shape"
  | "mobility";

export type ActivityLevel =
  | "mostly_sitting"
  | "lightly_active"
  | "moderately_active"
  | "very_active";

export type HealthInput = {
  gender: Gender;
  goal: Goal;
  age: number;
  height: number;
  weight: number;
  target_weight?: number;
  activity_level?: ActivityLevel;
  sleep_duration?: string;
  sleep_schedule?: string;
  meal_regularity?: string;
  eating_habit?: string;
  stress_level?: string;
};

export type HealthResult = {
  bmi: number;
  recommendedCalories: number;
  targetDate: string | null;
  healthScore: number;
  fullResult: {
    bmiCategory: string;
    activityLevel: string;
    summary: string;
    forecastCurve: Array<{
      week: number;
      weight: number;
    }>;
    recommendations: string[];
  };
};

export function calculateBMI(
  height: number,
  weight: number
) {
  if (height <= 0 || weight <= 0) {
    throw new Error("Invalid height or weight");
  }

  const heightInMeters = height / 100;

  return Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(2)
  );
}

export function getBMICategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateBMR(input: HealthInput) {
  const base =
    10 * input.weight +
    6.25 * input.height -
    5 * input.age;

  if (input.gender === "male") {
    return base + 5;
  }

  return base - 161;
}

export function getActivityFactor(
  activityLevel?: ActivityLevel
) {
  switch (activityLevel) {
    case "mostly_sitting":
      return 1.2;
    case "lightly_active":
      return 1.375;
    case "moderately_active":
      return 1.55;
    case "very_active":
      return 1.725;
    default:
      return 1.2;
  }
}

export function calculateRecommendedCalories(
  input: HealthInput
) {
  const bmr = calculateBMR(input);

  const tdee =
    bmr * getActivityFactor(input.activity_level);

  let adjustment = 0;

  if (input.goal === "lose_weight") {
    adjustment = -500;
  }

  if (input.goal === "build_muscle") {
    adjustment = 300;
  }

  return Math.round(tdee + adjustment);
}

export function calculateTargetDate(
  input: HealthInput
) {
  if (
    !input.target_weight ||
    input.goal === "maintain_weight" ||
    input.goal === "mobility"
  ) {
    return null;
  }

  const diff = Math.abs(
    input.weight - input.target_weight
  );

  let weeksNeeded = 12;

  if (input.goal === "lose_weight") {
    weeksNeeded = Math.ceil(diff / 0.5);
  }

  if (input.goal === "build_muscle") {
    weeksNeeded = Math.ceil(diff / 0.25);
  }

  if (input.goal === "improve_body_shape") {
    weeksNeeded = 12;
  }

  const targetDate = new Date();

  targetDate.setDate(
    targetDate.getDate() + weeksNeeded * 7
  );

  return targetDate.toISOString().split("T")[0];
}

export function calculateHealthScore(
  input: HealthInput,
  bmi: number
) {
  let score = 100;

  if (bmi < 18.5 || bmi >= 30) {
    score -= 20;
  } else if (bmi >= 25) {
    score -= 10;
  }

  if (
    input.sleep_duration === "less_than_5" ||
    input.sleep_schedule === "highly_irregular"
  ) {
    score -= 15;
  }

  if (
    input.meal_regularity === "highly_irregular" ||
    input.eating_habit === "high_sugar_high_fat"
  ) {
    score -= 15;
  }

  if (input.stress_level === "very_high") {
    score -= 15;
  } else if (input.stress_level === "high") {
    score -= 10;
  }

  if (input.activity_level === "mostly_sitting") {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function generateForecastCurve(
  input: HealthInput
) {
  const curve = [];

  const startWeight = input.weight;
  const targetWeight =
    input.target_weight || input.weight;

  const weeks = 12;

  for (let week = 0; week <= weeks; week++) {
    const progress = week / weeks;

    const projectedWeight =
      startWeight +
      (targetWeight - startWeight) * progress;

    curve.push({
      week,
      weight: Number(projectedWeight.toFixed(1)),
    });
  }

  return curve;
}

export function generateRecommendations(
  input: HealthInput
) {
  const recommendations: string[] = [];

  if (input.sleep_duration === "less_than_5") {
    recommendations.push(
      "Improve sleep duration to support recovery and weight management."
    );
  }

  if (input.meal_regularity === "highly_irregular") {
    recommendations.push(
      "Build a more consistent meal schedule to improve energy and adherence."
    );
  }

  if (input.activity_level === "mostly_sitting") {
    recommendations.push(
      "Add short movement breaks during the day to reduce stiffness and improve activity level."
    );
  }

  if (input.goal === "mobility") {
    recommendations.push(
      "Start with beginner-friendly yoga, Pilates, or stretching sessions 3 times per week."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain your current habits and follow a structured weekly plan."
    );
  }

  return recommendations;
}

export function generateHealthAssessment(
  input: HealthInput
): HealthResult {
  const bmi = calculateBMI(
    input.height,
    input.weight
  );

  const recommendedCalories =
    calculateRecommendedCalories(input);

  const targetDate =
    calculateTargetDate(input);

  const healthScore =
    calculateHealthScore(input, bmi);

  return {
    bmi,
    recommendedCalories,
    targetDate,
    healthScore,
    fullResult: {
      bmiCategory: getBMICategory(bmi),
      activityLevel:
        input.activity_level || "mostly_sitting",
      summary:
        "Your personalized health analysis is ready.",
      forecastCurve:
        generateForecastCurve(input),
      recommendations:
        generateRecommendations(input),
    },
  };
}