import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let requestCount = 0;

export async function POST(req: Request) {
  try {
    if (requestCount > 50) {
      return Response.json({
        error: "Daily limit reached",
      });
    }

    requestCount++;

    const body = await req.json();

    const { topic } = body;

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

    return Response.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      error: "Something went wrong",
    });
  }
}