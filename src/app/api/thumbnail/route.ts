import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `
Create an ultra realistic cinematic YouTube thumbnail about: ${prompt}.

Style:
- Viral YouTube thumbnail
- High contrast
- Emotional faces
- Dramatic lighting
- Bold composition
- Ultra detailed
- Sharp focus
- Vibrant colors
- Professional Photoshop look
- MrBeast style thumbnail
- Big readable text
- Clickworthy
- 4K quality
`,
      size: "1536x1024",
    });

    return NextResponse.json({
      image: `data:image/png;base64,${response.data?.[0]?.b64_json}`,
    });
  } catch (error) {
    console.log("THUMBNAIL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}