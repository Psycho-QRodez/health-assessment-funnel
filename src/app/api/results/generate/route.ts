import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  generateHealthAssessment,
  HealthInput,
} from "@/lib/health/calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "SessionId is required",
        },
        { status: 400 }
      );
    }

    const { data: session, error: sessionError } =
      await supabase
        .from("assessment_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

    if (sessionError || !session) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment session not found",
        },
        { status: 404 }
      );
    }

    const formData = session.form_data;

    const requiredFields = [
      "gender",
      "goal",
      "age",
      "height",
      "weight",
    ];

    for (const field of requiredFields) {
      if (
        formData[field] === undefined ||
        formData[field] === null
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    const weight = Number(formData.weight);
    const targetWeight =
      formData.target_weight !== undefined
        ? Number(formData.target_weight)
        : undefined;

    if (
      formData.goal === "lose_weight" &&
      targetWeight === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Target weight is required for weight loss goal.",
        },
        { status: 400 }
      );
    }

    if (
      formData.goal === "lose_weight" &&
      targetWeight !== undefined &&
      targetWeight >= weight
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your target weight should be lower than your current weight to create a weight-loss plan.",
        },
        { status: 400 }
      );
    }

    const healthInput: HealthInput = {
      gender: formData.gender,
      goal: formData.goal,
      age: Number(formData.age),
      height: Number(formData.height),
      weight,
      target_weight: targetWeight,
      activity_level: formData.activity_level,
      sleep_duration: formData.sleep_duration,
      sleep_schedule: formData.sleep_schedule,
      meal_regularity: formData.meal_regularity,
      eating_habit: formData.eating_habit,
      stress_level: formData.stress_level,
    };

    const result =
      generateHealthAssessment(healthInput);

    const { data: savedResult, error: resultError } =
      await supabase
        .from("assessment_results")
        .insert({
          session_id: sessionId,
          bmi: result.bmi,
          recommended_calories:
            result.recommendedCalories,
          target_date: result.targetDate,
          health_score: result.healthScore,
          full_result: result.fullResult,
        })
        .select()
        .single();

    if (resultError) {
      throw resultError;
    }

    await supabase
      .from("assessment_sessions")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json({
      success: true,
      resultId: savedResult.id,
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to generate health assessment",
      },
      { status: 500 }
    );
  }
}