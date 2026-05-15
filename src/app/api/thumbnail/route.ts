import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { prompt } = body;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `
Create a cinematic viral YouTube thumbnail.

Topic:
${prompt}

Style:
ultra realistic,
high contrast,
dramatic lighting,
clickworthy,
bold,
viral,
professional YouTube thumbnail
`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data?.[0]?.url;

    return Response.json({
      image: imageUrl,
    });

  } catch (error) {

    console.log("THUMBNAIL ERROR:", error);

    return Response.json({
      error: "Thumbnail generation failed",
    });
  }
}