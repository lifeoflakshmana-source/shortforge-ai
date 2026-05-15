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
      .from("users")
      .select("credits")
      .eq("user_id", userId)
      .single();

    return Response.json(data);

  } catch (error) {

    console.log(error);

    return Response.json({
      error: "Failed to fetch credits",
    });
  }
}

export async function POST(req: Request) {

  try {

    const { userId } = await auth();

    if (!userId) {
      return Response.json({
        error: "Unauthorized",
      });
    }

    const body = await req.json();

    const { credits } = body;

    await supabase
      .from("users")
      .update({
        credits,
      })
      .eq("user_id", userId);

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      error: "Failed to update credits",
    });
  }
}