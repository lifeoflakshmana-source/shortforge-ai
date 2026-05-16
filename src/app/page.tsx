"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect } from "react";
import jsPDF from "jspdf";

declare global {
  interface Window {
    Razorpay: new (options: unknown) => {
  open: () => void;
};
  }
}

export default function Home() {
  const { isSignedIn } = useUser();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(5);
  const [scripts, setScripts] = useState<unknown[]>([]);

  // Generate Script
  const generateScript = async () => {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          topic,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data.result);
      setCredits(data.credits);

    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Buy Credits
  const buyCredits = async (amount: number) => {
    try {
      if (!isSignedIn) {
        alert("Please login first");
        return;
      }

      const response = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({
          amount,
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

          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            body: JSON.stringify({
              amount,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.credits) {
            setCredits(verifyData.credits);
          }

          alert("Payment Successful");
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new window.Razorpay(
  options as never
);
      razorpay.open();

    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }
  };
  const fetchScripts = async () => {

  try {

    const response = await fetch("/api/scripts");

    const data = await response.json();

    setScripts(data);

  } catch (error) {

    console.log(error);

  }
};
const copyScript = async () => {

  try {

    await navigator.clipboard.writeText(result);

    alert("Script copied!");

  } catch (error) {

    console.log(error);

  }
};

const downloadTXT = () => {

  const element = document.createElement("a");

  const file = new Blob([result], {
    type: "text/plain",
  });

  element.href = URL.createObjectURL(file);

  element.download = "shortforge-script.txt";

  document.body.appendChild(element);

  element.click();
};

const downloadPDF = () => {

  const doc = new jsPDF();

  const lines = doc.splitTextToSize(result, 180);

  doc.text(lines, 10, 10);

  doc.save("shortforge-script.pdf");
};

useEffect(() => {

  fetchScripts();

}, []);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10 sticky top-0 bg-black/70 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-3xl font-bold tracking-tight">
            ShortForge AI
          </h1>

          <div className="flex items-center gap-4">

            {isSignedIn && (
              <>
                <div className="px-4 py-2 rounded-xl bg-white/10 text-sm">
                  Credits: {credits}
                </div>

                <Button
                  onClick={() => buyCredits(99)}
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  ₹99
                </Button>

                <Button
                  onClick={() => buyCredits(299)}
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  ₹299
                </Button>

                <Button
                  onClick={() => buyCredits(999)}
                  className="bg-purple-600 hover:bg-purple-700 rounded-xl"
                >
                  ₹999
                </Button>

                <UserButton />
              </>
            )}

            {!isSignedIn && (
              <SignInButton mode="modal">
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl">
                  Login
                </Button>
              </SignInButton>
            )}

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-28 px-6 text-center">

        <div className="max-w-5xl mx-auto">

          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm mb-8">
            AI-powered viral content engine
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
            Generate Viral
            <br />
            Reels Scripts Instantly
          </h1>

          <p className="mt-8 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Create hooks, scripts, scene ideas, captions and B-roll concepts
            for Instagram Reels and YouTube Shorts using AI.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">

            <Button
  size="lg"
  className="bg-white text-black hover:bg-zinc-200 rounded-2xl px-8"
  onClick={() => window.location.href="/dashboard"}
>
  Start Creating
</Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-white/10 bg-transparent"
            >
              Watch Demo
            </Button>

          </div>

          <div className="mt-12 text-zinc-500 text-sm">
            Trusted by creators • 10,000+ scripts generated
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="border border-white/10 bg-white/5 rounded-3xl p-8">
            <div className="text-purple-400 text-4xl font-bold">1</div>

            <h3 className="text-2xl font-bold mt-4">
              Enter Topic
            </h3>

            <p className="text-zinc-400 mt-3">
              Enter any niche, idea or topic for your next viral reel.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 rounded-3xl p-8">
            <div className="text-purple-400 text-4xl font-bold">2</div>

            <h3 className="text-2xl font-bold mt-4">
              AI Creates Script
            </h3>

            <p className="text-zinc-400 mt-3">
              Generate hooks, storytelling, scenes and cinematic B-roll ideas.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 rounded-3xl p-8">
            <div className="text-purple-400 text-4xl font-bold">3</div>

            <h3 className="text-2xl font-bold mt-4">
              Post & Grow
            </h3>

            <p className="text-zinc-400 mt-3">
              Turn scripts into viral Instagram Reels and YouTube Shorts.
            </p>
          </div>

        </div>
      </section>

      {/* Generator */}
      <section
        id="generator"
        className="max-w-5xl mx-auto px-6 py-24"
      >

        <div className="border border-white/10 bg-white/5 rounded-[40px] p-10">

          <h2 className="text-5xl font-black mb-10">
            Create Your Script
          </h2>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder='Try topics like: "Money mindset", "Why people fail"'
            className="w-full h-44 rounded-3xl bg-black border border-white/10 p-6 text-lg outline-none"
          />

          <div className="flex flex-wrap gap-3 mt-6">

            {["Motivational", "Dark", "Cinematic", "Luxury"].map((item) => (
              <button
                key={item}
                onClick={() => setTopic(item)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                {item}
              </button>
            ))}

          </div>

          <Button
            onClick={generateScript}
            disabled={loading}
            className="mt-8 w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-lg"
          >
            {loading ? "Generating..." : "Generate Script"}
          </Button>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-10 border border-white/10 bg-black rounded-3xl p-8 prose prose-invert max-w-none">
              <div className="flex gap-3 mb-6 flex-wrap">

  <Button
    onClick={copyScript}
    className="rounded-xl"
  >
    Copy
  </Button>

  <Button
    onClick={downloadTXT}
    className="rounded-xl"
  >
    Download TXT
  </Button>

  <Button
    onClick={downloadPDF}
    className="rounded-xl"
  >
    Download PDF
  </Button>

</div>
              <ReactMarkdown>
                {result}
              </ReactMarkdown>
            </div>
          )}

        </div>

      </section>

      {/* Recent Scripts */}
<section className="max-w-6xl mx-auto px-6 pb-24">

  <h2 className="text-4xl font-black mb-10">
    Recent Scripts
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    {Array.isArray(scripts) &&
  scripts.map((script: any) => (

      <div
        key={script.id}
        className="border border-white/10 bg-white/5 rounded-3xl p-6"
      >

        <div className="text-sm text-purple-400 mb-3">
          {new Date(script.created_at).toLocaleDateString()}
        </div>

        <h3 className="text-2xl font-bold mb-4">
          {script.topic}
        </h3>

        <p className="text-zinc-400 line-clamp-4">
          {script.content}
        </p>

        <Button
          className="mt-6 rounded-xl"
          onClick={() => {
            setResult(script.content);
            window.scrollTo({
              top: 800,
              behavior: "smooth",
            });
          }}
        >
          Open Script
        </Button>

      </div>

    ))}

  </div>

</section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-black">
            Simple Pricing
          </h2>

          <p className="text-zinc-400 mt-4 text-lg">
            Buy credits and generate unlimited viral ideas.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="border border-white/10 bg-white/5 rounded-3xl p-10">
            <h3 className="text-3xl font-bold">
              Starter
            </h3>

            <div className="text-5xl font-black mt-6">
              ₹99
            </div>

            <p className="text-zinc-400 mt-4">
              10 AI Credits
            </p>

            <Button
              onClick={() => buyCredits(99)}
              className="w-full mt-8 rounded-2xl bg-purple-600 hover:bg-purple-700"
            >
              Buy Now
            </Button>
          </div>

          <div className="border border-purple-500 bg-purple-500/10 rounded-3xl p-10 scale-105">
            <div className="text-sm text-purple-300 mb-4">
              MOST POPULAR
            </div>

            <h3 className="text-3xl font-bold">
              Pro
            </h3>

            <div className="text-5xl font-black mt-6">
              ₹299
            </div>

            <p className="text-zinc-400 mt-4">
              50 AI Credits
            </p>

            <Button
              onClick={() => buyCredits(299)}
              className="w-full mt-8 rounded-2xl bg-purple-600 hover:bg-purple-700"
            >
              Buy Now
            </Button>
          </div>

          <div className="border border-white/10 bg-white/5 rounded-3xl p-10">
            <h3 className="text-3xl font-bold">
              Unlimited
            </h3>

            <div className="text-5xl font-black mt-6">
              ₹999
            </div>

            <p className="text-zinc-400 mt-4">
              999 AI Credits
            </p>

            <Button
              onClick={() => buyCredits(999)}
              className="w-full mt-8 rounded-2xl bg-purple-600 hover:bg-purple-700"
            >
              Buy Now
            </Button>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-zinc-500">
        © 2026 ShortForge AI. All rights reserved.
      </footer>

    </main>
  );
}