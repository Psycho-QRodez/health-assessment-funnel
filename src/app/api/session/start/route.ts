import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {

    const sessionToken = uuidv4();

    // Step 1 创建 User

    const {
      data: user,
      error: userError,
    } = await supabase
      .from("users")
      .insert({
        session_token: sessionToken,
      })
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    // Step 2 创建 Assessment Session

    const {
      data: assessmentSession,
      error: sessionError,
    } = await supabase
      .from("assessment_sessions")
      .insert({
        user_id: user.id,
        current_step: 1,
        status: "draft",
      })
      .select()
      .single();

    if (sessionError) {
      throw sessionError;
    }

    return NextResponse.json({
      success: true,

      userId: user.id,

      sessionId:
        assessmentSession.id,

      sessionToken,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create session",
      },
      {
        status: 500,
      }
    );
  }
}