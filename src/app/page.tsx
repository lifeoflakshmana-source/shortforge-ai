"use client";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function Home() {

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(5);

  // Generate Script
  const generateScript = async () => {

    try {

      setLoading(true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      console.log(data);

      if (data.error) {
        setError(data.error);
        return;
      }

      setError("");

      setResult(data.result);

      setCredits(data.credits);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // Buy Credits
  const buyCredits = async (
  amount: number,
  creditsToAdd: number
) => {

  try {

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        credits: creditsToAdd,
      }),
    });

    const data = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: data.amount,

      currency: data.currency,

      name: "ShortForge AI",

      description: "Buy Credits",

      order_id: data.id,

      handler: async function () {

        await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credits: creditsToAdd,
          }),
        });

        setCredits((prev) => prev + creditsToAdd);

        alert("Payment Successful!");
      },

      theme: {
        color: "#7c3aed",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (error) {

    console.log(error);

  }
};

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-700px h-700px bg-purple-500/20 blur-[120px] rounded-full"></div>

      {/* Navbar */}
      <nav className="w-full border-b border-white/10 backdrop-blur-xl relative z-10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-2xl font-bold tracking-tight">
            ShortForge AI
          </h1>

          <div className="flex gap-3">

          <div className="px-4 py-2 rounded-xl bg-white/10 text-sm">
  Credits: {credits}
</div>

  <Button
    onClick={() => buyCredits(9900, 10)}
    className="bg-purple-600 hover:bg-purple-700"
  >
    ₹99
  </Button>

  <Button
    onClick={() => buyCredits(29900, 50)}
    className="bg-purple-600 hover:bg-purple-700"
  >
    ₹299
  </Button>

  <Button
    onClick={() => buyCredits(99900, 250)}
    className="bg-purple-600 hover:bg-purple-700"
  >
    ₹999
  </Button>

</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex items-center justify-center px-6 py-24 relative z-10">

        <div className="max-w-6xl text-center">

          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 mb-8">
            AI-powered viral content engine
          </div>

          <h1 className="text-8xl font-bold tracking-tight leading-tight mb-6">
            Generate Viral <br />
            Reels Scripts Instantly
          </h1>

          <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Create hooks, scripts, scene ideas, captions and B-roll concepts
            for Instagram Reels and YouTube Shorts using AI.
          </p>

          <div className="flex items-center justify-center gap-4">

            <Button className="rounded-2xl px-8 py-6 text-lg">
              Start Creating
            </Button>

            <Button
              variant="outline"
              className="rounded-2xl px-8 py-6 text-lg bg-transparent border-white/20"
            >
              Watch Demo
            </Button>

          </div>
        </div>
      </section>

      {/* Input Section */}
      <section className="px-6 pb-32 relative z-10">

        <div className="max-w-6xl mx-auto">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

            <h2 className="text-3xl font-bold mb-6">
              Create Your Script
            </h2>

            <textarea
              placeholder="Enter your video topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-40 rounded-2xl bg-black/40 border border-white/10 p-5 text-lg outline-none resize-none"
            />

            <p className="text-sm text-zinc-500 mt-3">
              Try topics like: &quot;Money mindset&quot;, &quot;Why people fail&quot;
            </p>

            <div className="flex gap-4 mt-6 flex-wrap">

              <Button variant="secondary">
                Motivational
              </Button>

              <Button variant="secondary">
                Dark
              </Button>

              <Button variant="secondary">
                Cinematic
              </Button>

              <Button variant="secondary">
                Luxury
              </Button>

            </div>

            <Button
              onClick={generateScript}
              className="w-full mt-8 rounded-2xl py-6 text-lg"
            >
              {loading ? "Generating..." : "Generate Script"}
            </Button>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {result && (

              <div className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-8">

                <div className="flex items-center justify-between mb-6">

                  <h3 className="text-2xl font-bold">
                    Generated Script
                  </h3>

                </div>

                <div className="prose prose-invert prose-headings:text-white prose-p:text-zinc-300 max-w-none">

                  <ReactMarkdown>
                    {result}
                  </ReactMarkdown>

                </div>

              </div>
            )}

          </div>
        </div>
      </section>

    </main>
  );
}