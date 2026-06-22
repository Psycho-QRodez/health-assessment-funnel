import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ProgressSchema } from "@/lib/validation/progress";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = ProgressSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      sessionId,
      questionKey,
      answerValue,
      currentStep,
    } = validationResult.data;

    const { data: sessionData, error: sessionReadError } =
      await supabase
        .from("assessment_sessions")
        .select("id, form_data")
        .eq("id", sessionId)
        .single();

    if (sessionReadError || !sessionData) {
      return NextResponse.json(
        {
          success: false,
          error: "Session not found",
        },
        { status: 404 }
      );
    }

    const { error: answerError } = await supabase
      .from("assessment_answers")
      .upsert(
        {
          session_id: sessionId,
          question_key: questionKey,
          answer_value: answerValue,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "session_id,question_key",
        }
      );

    if (answerError) throw answerError;

    const updatedFormData = {
      ...(sessionData.form_data || {}),
      [questionKey]: answerValue,
    };

    const { error: sessionUpdateError } = await supabase
      .from("assessment_sessions")
      .update({
        current_step: currentStep,
        form_data: updatedFormData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (sessionUpdateError) throw sessionUpdateError;

    return NextResponse.json({
      success: true,
      message: "Progress saved",
      currentStep,
      formData: updatedFormData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}