import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({
      error: "Unauthorized",
    });
  }

  try {
    const body = await req.json();

    const { topic } = body;

    if (!topic) {
      return Response.json({
        error: "Topic is required",
      });
    }

    // Get existing user
    let { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Create new user if not exists
    if (!userData) {
      await supabase.from("users").insert([
        {
          user_id: userId,
          credits: 5,
        },
      ]);

      const { data: newUser } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();

      userData = newUser;
    }

    // Stop if no credits
    if (!userData) {
      return Response.json({
        error: "User not found",
      });
    }

    if (userData.credits <= 0) {
      return Response.json({
        error: "No credits remaining",
      });
    }

    // Generate AI content
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an elite viral content strategist.

Generate content in this exact format:

# Hook

# Script

# Scene Ideas

# B-Roll Ideas

# CTA

Make the content cinematic, emotional and highly engaging.
          `,
        },
        {
          role: "user",
          content: topic,
        },
      ],
    });

    // Deduct credit
    await supabase
      .from("users")
      .update({
        credits: userData.credits - 1,
      })
      .eq("user_id", userId);

    return Response.json({
      result: completion.choices[0].message.content,
      credits: userData.credits - 1,
    });
  } catch (error) {
    console.log("FULL ERROR:", error);

    return Response.json({
      error: String(error),
    });
  }
}