import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({
        error: "Unauthorized",
      });
    }

    const { data } = await supabase
      .from("scripts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    return Response.json(data);

  } catch (error) {
    console.log(error);

    return Response.json({
      error: "Failed to fetch scripts",
    });
  }
}