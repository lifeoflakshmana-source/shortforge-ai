import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const topic = body.prompt;
const style = body.style || "MrBeast";

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
You are a viral short-form content creator.

Generate cinematic YouTube Shorts / Reels scripts.

The response must include:

HOOK:
INTRO:
POINT 1:
POINT 2:
POINT 3:
TWIST:
ENDING CTA:

BROLL IDEAS:
- 5 cinematic B-roll shot ideas
- camera angles
- transitions
- visual suggestions

Style:
- Emotional
- High retention
- Curiosity driven
- Fast paced
- Human sounding
- Cinematic

Avoid generic filler.
Make every output unique.
`,
        },

        {
          role: "user",
          content: `
Create a viral short-form video script.

TOPIC:
${topic}

STYLE:
${style}

The script should match the selected style perfectly.

Examples:

MrBeast:
- explosive
- high energy
- shocking

Dark:
- mysterious
- psychological
- suspense

Documentary:
- informative
- cinematic narration

Motivational:
- emotional
- inspiring

Anime:
- dramatic
- intense
- heroic

Cinematic:
- movie-like narration
- emotional visuals
`,
        },
      ],

      temperature: 0.9,
      max_tokens: 700,
    });

    const script =
      completion.choices[0].message.content;

    return NextResponse.json({
      result: script,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      result: "Script generation failed.",
    });

  }

}