import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const sessionId =
    req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      {
        success: false,
        error: "SessionId required",
      },
      { status: 400 }
    );
  }

  const { data: result, error: resultError } =
    await supabase
      .from("assessment_results")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .single();

  if (resultError || !result) {
    return NextResponse.json(
      {
        success: false,
        error: "Result not found",
      },
      { status: 404 }
    );
  }

  const { data: session, error: sessionError } =
    await supabase
      .from("assessment_sessions")
      .select("user_id")
      .eq("id", sessionId)
      .single();

  if (sessionError || !session) {
    return NextResponse.json(
      {
        success: false,
        error: "Session not found",
      },
      { status: 404 }
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user_id)
    .eq("status", "active")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  const isPremium =
    subscription?.status === "active";

  if (!isPremium) {
    return NextResponse.json({
      success: true,
      premiumLocked: true,
      result: {
        bmi: result.bmi,
        healthScore: result.health_score,
        recommendedCalories:
          result.recommended_calories,
        bmiCategory:
          result.full_result?.bmiCategory,
      },
      message:
        "Unlock your 12-week personalized program and coaching plan.",
    });
  }

  return NextResponse.json({
    success: true,
    premiumLocked: false,
    result: {
      bmi: result.bmi,
      healthScore: result.health_score,
      recommendedCalories:
        result.recommended_calories,
      targetDate: result.target_date,
      bmiCategory:
        result.full_result?.bmiCategory,
      forecastCurve:
        result.full_result?.forecastCurve,
      recommendations:
        result.full_result?.recommendations,
      summary:
        result.full_result?.summary,
    },
  });
}