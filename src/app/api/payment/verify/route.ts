import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({
      error: "Unauthorized",
    });
  }

  const body = await req.json();

  const { creditsToAdd } = body;

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
  });
}