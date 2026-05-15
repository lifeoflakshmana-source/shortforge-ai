import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({
        error: "Unauthorized",
      });
    }

    const body = await req.json();

    const amount = body.amount;

    let creditsToAdd = 0;

    if (amount === 99) {
      creditsToAdd = 10;
    }

    if (amount === 299) {
      creditsToAdd = 50;
    }

    if (amount === 999) {
      creditsToAdd = 999;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!userData) {
      return Response.json({
        error: "User not found",
      });
    }

    await supabase
      .from("users")
      .update({
        credits: userData.credits + creditsToAdd,
      })
      .eq("user_id", userId);

    return Response.json({
      success: true,
      credits: userData.credits + creditsToAdd,
    });

  } catch (error) {
    console.log(error);

    return Response.json({
      error: "Verification failed",
    });
  }
}