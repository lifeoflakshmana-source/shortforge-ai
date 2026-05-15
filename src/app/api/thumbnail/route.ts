import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { prompt } = body;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `
      Create a highly viral YouTube thumbnail.

      Style:
      cinematic,
      ultra detailed,
      bold text,
      high contrast,
      emotional,
      clickworthy.

      Topic:
      ${prompt}
      `,
      size: "1024x1024",
    });

    return Response.json({
      image: response.data?.[0]?.b64_json || "",
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      error: "Failed to generate thumbnail",
    });
  }
}