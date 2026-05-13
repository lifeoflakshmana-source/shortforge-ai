import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
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

        Make the content cinematic, emotional, highly engaging and optimized for retention.
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