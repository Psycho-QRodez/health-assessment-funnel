import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "SessionId required",
        },
        { status: 400 }
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

    const activatedAt = new Date();

    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    const { data: subscription, error: subscriptionError } =
      await supabase
        .from("subscriptions")
        .upsert(
          {
            user_id: session.user_id,
            status: "active",
            activated_at: activatedAt.toISOString(),
            expires_at: expiresAt.toISOString(),
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

    if (subscriptionError) {
      throw subscriptionError;
    }

    return NextResponse.json({
      success: true,
      message: "Subscription activated",
      subscription,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to activate subscription",
      },
      { status: 500 }
    );
  }
}