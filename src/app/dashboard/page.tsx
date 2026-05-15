"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";



export default function DashboardPage() {

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [scripts, setScripts] = useState<unknown[]>([]);
  const [credits, setCredits] = useState(5);
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {

  fetchCredits();
  fetchScripts();

}, []);

const fetchCredits = async () => {

  try {

    const response = await fetch("/api/credits");

    const data = await response.json();

    if (data?.credits !== undefined) {

      setCredits(data.credits);

    }

  } catch (error) {

    console.log(error);

  }
};

const fetchScripts = async () => {

  try {

    const response = await fetch("/api/scripts");

    const data = await response.json();

    if (Array.isArray(data)) {

      setScripts(data);

    }

  } catch (error) {

    console.log(error);

  }
};

  const generateScript = async () => {

    if (!topic) return;

    if (credits <= 0) {
      alert("No credits left. Please purchase more credits.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      const generatedScript =
        data.script || "No script generated.";

      setResult(generatedScript);

      // Reduce credits
      const updatedCredits = credits - 1;

setCredits(updatedCredits);

await fetch("/api/credits", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    credits: updatedCredits,
  }),
});

      const newScript = {
  topic,
  content: generatedScript,
  score: Math.floor(Math.random() * 20) + 80,
};

await fetch("/api/scripts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newScript),
});

fetchScripts();

    } catch (error) {

      console.log(error);

      setResult("Something went wrong.");

    } finally {

      setLoading(false);

    }
  };

  const generateThumbnail = async () => {
  if (!thumbnailPrompt) return;

  try {
    setThumbnailLoading(true);

    const enhancedPrompt =
  "Ultra realistic cinematic YouTube thumbnail about " +
  thumbnailPrompt +
  ", dramatic lighting, emotional reactions, viral YouTube thumbnail style, high contrast, vibrant colors, sharp focus";

const response = await fetch("/api/thumbnail", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({
    prompt: enhancedPrompt,
  }),
});
    const data = await response.json();
    setThumbnail(data.image);

  } catch (error) {
    console.log(error);
    alert("Failed to generate thumbnail");
  } finally {
    setThumbnailLoading(false);
  }
};

  const buyCredits = async () => {

    try {

      const response = await fetch("/api/payment", {
        method: "POST",
      });
      

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "ShortForge AI",

        description: "Buy Credits",

        order_id: order.id,

        handler: async function () {

          const updatedCredits = credits + 10;

setCredits(updatedCredits);

await fetch("/api/credits", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    credits: updatedCredits,
  }),
});

          alert("Payment Successful!");
        },

        theme: {
          color: "#7c3aed",
        },
      };

      

      const Razorpay = (window as any).Razorpay;

        const razorpay = new Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert("Payment failed");

    }
  };

  return (

    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-purple-950 text-white p-6">

      {/* Navbar */}

      <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">

        <h1 className="text-3xl font-black tracking-tight">
          ShortForge AI
        </h1>

        <div className="flex items-center gap-4">

          <Button
            className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            onClick={() => window.location.href = "/"}
          >
            Home
          </Button>

        </div>

      </div>

      {/* Header */}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-8">

        <div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            Welcome back 👋
          </h1>

          <p className="text-zinc-400 text-lg md:text-2xl">
            klakshmanadattu@gmail.com
          </p>

        </div>

        <div>

          <div className="bg-zinc-900/80 border border-purple-500/20 px-6 py-4 rounded-3xl text-2xl font-bold shadow-[0_0_30px_rgba(168,85,247,0.25)]">
            Credits: {credits}
          </div>

          {credits <= 2 && (
            <div className="mt-3 text-red-400 text-sm font-semibold">
              Low credits remaining ⚠️
            </div>
          )}

          <Button
            onClick={buyCredits}
            className="mt-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl w-full"
          >
            Buy Credits
          </Button>

        </div>

      </div>

      {/* Generator Box */}

      <div className="max-w-6xl mx-auto mt-12 border border-white/10 rounded-[32px] bg-zinc-950/80 backdrop-blur-xl p-8 hover:border-purple-500/40 transition-all duration-300">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-4xl md:text-6xl font-black">
            Generate Viral Script
          </h2>

          <div className="hidden md:flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl">

            <span className="text-purple-400 text-sm font-semibold">
              AI Powered
            </span>

          </div>

        </div>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your reel topic..."
          className="w-full h-56 bg-black/80 border border-white/10 rounded-3xl p-6 text-xl outline-none resize-none focus:border-purple-500 transition-all duration-300"
        />

        <Button
          onClick={generateScript}
          disabled={loading}
          className="mt-6 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:scale-105 transition-all duration-300 text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-[0_0_40px_rgba(168,85,247,0.5)]"
        >
          {loading
            ? "Generating Viral Script..."
            : "🚀 Generate Viral Script"}
        </Button>

      </div>

      {/* Result Section */}

      {result && (

        <div className="max-w-6xl mx-auto mt-10 border border-purple-500/20 rounded-3xl p-8 bg-zinc-900/70 backdrop-blur-xl">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

            <h2 className="text-3xl md:text-4xl font-black">
              Generated Script ✨
            </h2>

            <Button
              onClick={() => navigator.clipboard.writeText(result)}
              className="bg-white text-black hover:bg-zinc-200 rounded-xl"
            >
              Copy Script
            </Button>

          </div>

          <div className="whitespace-pre-wrap leading-8 text-zinc-200 text-lg">
            {result}
          </div>

        </div>

      )}

      {/* Feature Cards */}

      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6">

        <div className="border border-white/10 bg-zinc-950/70 backdrop-blur-xl rounded-3xl p-8 hover:border-purple-500/40 transition-all duration-300">

          <div className="text-5xl mb-5">
            🎣
          </div>

          <h3 className="text-3xl font-black mb-4">
            AI Hooks
          </h3>

          <p className="text-zinc-400 text-lg leading-7">
            Generate scroll-stopping hooks instantly using AI.
          </p>

        </div>

        <div className="border border-white/10 bg-zinc-950/70 backdrop-blur-xl rounded-3xl p-8 hover:border-purple-500/40 transition-all duration-300">

          <div className="text-5xl mb-5">
            🎬
          </div>

          <h3 className="text-3xl font-black mb-4">
            B-Roll Ideas
          </h3>

          <p className="text-zinc-400 text-lg leading-7">
            Cinematic B-roll shot suggestions for every scene.
          </p>

        </div>

        <div className="border border-white/10 bg-zinc-950/70 backdrop-blur-xl rounded-3xl p-8 hover:border-purple-500/40 transition-all duration-300">

          <div className="text-5xl mb-5">
            📈
          </div>

          <h3 className="text-3xl font-black mb-4">
            Viral Captions
          </h3>

          <p className="text-zinc-400 text-lg leading-7">
            AI-generated captions and hashtags for more reach.
          </p>

        </div>

      </div>

      {/* Thumbnail Generator Preview */}

      <div className="max-w-6xl mx-auto mt-20 border border-purple-500/20 rounded-[32px] bg-zinc-950/70 backdrop-blur-xl p-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

          <div>

            {/* AI Thumbnail Generator */}

<div className="max-w-6xl mx-auto mt-20 border border-purple-500/20 rounded-[32px] bg-zinc-950/70 backdrop-blur-xl p-8">

  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

    <div>

      <h2 className="text-4xl md:text-5xl font-black mb-3">
        AI Thumbnail Generator 🎨
      </h2>

      <p className="text-zinc-400 text-lg">
        Generate cinematic viral thumbnails instantly.
      </p>

    </div>

  </div>

  <textarea
    value={thumbnailPrompt}
    onChange={(e) => setThumbnailPrompt(e.target.value)}
    placeholder="Enter thumbnail idea..."
    className="w-full h-36 bg-black/80 border border-white/10 rounded-3xl p-6 text-xl outline-none resize-none focus:border-purple-500 transition-all duration-300"
  />

  <Button
    onClick={generateThumbnail}
    disabled={thumbnailLoading}
    className="disabled:opacity-50 disabled:cursor-not-allowed mt-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:scale-105 transition-all duration-300 text-white px-8 py-6 rounded-2xl text-lg font-bold"
  >
    {thumbnailLoading
      ? "Generating Thumbnail..."
      : "🎨 Generate Thumbnail"}
  </Button>

  {thumbnail && (
  <div className="mt-10">
    <img
      src={thumbnail}
      alt="Generated Thumbnail"
      className="rounded-3xl w-full max-w-2xl border border-white/10"
    />

    <a href={thumbnail} download="thumbnail.png">
      <Button className="mt-6 bg-white text-black hover:bg-zinc-200 rounded-2xl">
        Download Thumbnail
      </Button>
    </a>
  </div>
)}

</div>

            <p className="text-zinc-400 text-lg">
              Generate cinematic thumbnails instantly using AI.
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="h-56 rounded-3xl bg-gradient-to-br from-purple-600/30 to-fuchsia-600/20 border border-white/10"></div>

          <div className="h-56 rounded-3xl bg-gradient-to-br from-blue-600/30 to-cyan-600/20 border border-white/10"></div>

          <div className="h-56 rounded-3xl bg-gradient-to-br from-orange-600/30 to-red-600/20 border border-white/10"></div>

        </div>

      </div>

      {/* Recent Scripts */}

      <div className="max-w-6xl mx-auto mt-20">

        <div className="flex items-center justify-between mb-10">

          <h2 className="text-4xl font-black">
            Recent Scripts
          </h2>

          <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl">

            <span className="text-purple-400 font-semibold">
              AI Saved History
            </span>

          </div>

        </div>

        <div className="grid gap-6">

          {scripts.map((script: any) => (

            <div
              key={script.id}
              className="border border-white/10 bg-zinc-950/70 backdrop-blur-xl rounded-3xl p-6 hover:border-purple-500/40 transition-all duration-300"
            >

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">

                <div>

                  <h3 className="text-2xl font-bold">
                    {script.topic}
                  </h3>

                  <p className="text-zinc-500 text-sm mt-1">
                    {new Date(script.created_at).toLocaleString()}
                  </p>

                </div>

                <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl">

                  <span className="text-green-400 font-bold">
                    Viral Score: {script.score}/100
                  </span>

                </div>

              </div>

              <div className="text-zinc-300 leading-7 line-clamp-4">
                {script.content}
              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}