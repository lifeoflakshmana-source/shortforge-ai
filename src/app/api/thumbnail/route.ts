import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, aspectRatio } =
  await req.json();

  let width = 1280;
let height = 720;

if (aspectRatio === "1:1") {
  width = 1024;
  height = 1024;
}

if (aspectRatio === "9:16") {
  width = 720;
  height = 1280;
}

    const enhancedPrompt = `
Ultra realistic cinematic YouTube thumbnail about ${prompt},
MrBeast style,
viral thumbnail,
dramatic lighting,
high contrast,
vibrant colors,
4k,
emotional reactions,
professional Photoshop composition,
sharp focus,
clickworthy,
trending YouTube thumbnail
`;
    const imageUrl =
  "https://image.pollinations.ai/prompt/" +
  encodeURIComponent(enhancedPrompt) +
  `?width=${width}&height=${height}`;

    const imageResponse = await fetch(imageUrl);

    const buffer = await imageResponse.arrayBuffer();

    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({
      image: `data:image/jpeg;base64,${base64}`,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}