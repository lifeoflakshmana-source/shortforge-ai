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
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [thumbnailHistory, setThumbnailHistory] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [hooks, setHooks] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [viralScore, setViralScore] = useState(0);
  const [hookScore, setHookScore] = useState(0);
  const [emotionScore, setEmotionScore] = useState(0);
  const [retentionScore, setRetentionScore] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("MrBeast");
  const [brolls, setBrolls] = useState<string[]>([]);

  useEffect(() => {
  const savedProjects =
    localStorage.getItem("projects");

  if (savedProjects) {
    setProjects(JSON.parse(savedProjects));
  }
}, []);

  const [aspectRatio, setAspectRatio] =
  useState("16:9");

  useEffect(() => {
  const savedHistory = localStorage.getItem(
    "thumbnailHistory"
  );

  

  if (savedHistory) {
    setThumbnailHistory(
      JSON.parse(savedHistory)
    );
  }
}, []);

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
  try {
    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: topic,
        style: selectedStyle,
      }),
    });

    const data = await response.json();

    if (data.result) {

      setResult(data.result);

const lines = data.result.split("\n");

const extractedBrolls = lines.filter((line: string) =>
  line.includes("Shot") ||
  line.includes("Camera") ||
  line.includes("B-roll") ||
  line.includes("Transition")
);

setBrolls(extractedBrolls);

      setTitles([
        `${topic} EXPOSED 😱`,
        `Top 5 ${topic} Secrets`,
        `Why ${topic} Is Going Viral`,
        `${topic} Nobody Talks About`,
        `${topic} Changed Everything`,
      ]);

      setHooks([
        `Nobody talks about ${topic} like this...`,
        `This ${topic} trick is going viral`,
        `You are wasting time if you ignore ${topic}`,
        `The dark truth behind ${topic}`,
      ]);

      setHashtags([
        `#${topic.replace(/\s+/g, "")}`,
        "#viral",
        "#fyp",
        "#trending",
        "#shorts",
        "#reels",
      ]);

      setCaptions([
        
        `This ${topic} will blow your mind 🤯`,
        `Nobody expected this about ${topic} 👀`,
        `Save this before it disappears 🚀`,
      ]);

      setViralScore(Math.floor(Math.random() * 15) + 85);
      setHookScore(Math.floor(Math.random() * 15) + 80);
      setEmotionScore(Math.floor(Math.random() * 15) + 82);
      setRetentionScore(Math.floor(Math.random() * 15) + 84);

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
        content: data.result,
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

    } else {
      setResult("Script generation failed.");
    }

  } catch (error) {

    console.log(error);
    setResult("Something went wrong.");

  } finally {

    setLoading(false);

  }
};



const saveProject = () => {

  const newProject = {
    topic,
    result,
    thumbnails,
    brolls,
    style: selectedStyle,
    createdAt: new Date().toISOString(),
  };

  const updatedProjects = [
    newProject,
    ...projects,
  ];

  setProjects(updatedProjects);

  localStorage.setItem(
    "projects",
    JSON.stringify(updatedProjects)
  );

};

const generateThumbnail = async () => {
  if (credits <= 0) {
  alert("No credits left");
  return;
}
  try {
    setThumbnailLoading(true);

    const enhancedPrompt = `
Ultra realistic cinematic YouTube thumbnail,
${thumbnailPrompt},
MrBeast style,
viral thumbnail,
dramatic lighting,
high contrast,
4k,
emotional faces,
professional Photoshop composition
`;

    const response = await fetch("/api/thumbnail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        aspectRatio,
      }),
    });

    const data = await response.json();

    const images = data.images || [data.image];

    setThumbnails(images);
    console.log(images);

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

    setThumbnailHistory((prev) => {
      const updatedHistory = [
        ...images,
        ...prev,
      ];

      localStorage.setItem(
        "thumbnailHistory",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

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

        <div className="flex flex-wrap gap-3 mt-5">

  {[
    "MrBeast",
    "Dark",
    "Documentary",
    "Motivational",
    "Cinematic",
    "Anime",
  ].map((style) => (

    <button
      key={style}
      onClick={() => setSelectedStyle(style)}
      className={`px-5 py-2 rounded-2xl border transition-all duration-300
      ${
        selectedStyle === style
          ? "bg-purple-600 border-purple-500"
          : "bg-zinc-900 border-white/10 hover:border-purple-500"
      }`}
    >
      {style}
    </button>

  ))}

</div>

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

            <div className="flex gap-3">

  <Button
    onClick={() => {
      navigator.clipboard.writeText(result);
    }}
    className="bg-white text-black hover:bg-zinc-200"
  >
    Copy Script
  </Button>

  <Button
    onClick={() => {

      const blob = new Blob([result], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "viral-script.txt";

      a.click();

      URL.revokeObjectURL(url);

    }}
    className="bg-pink-600 hover:bg-pink-700"
  >
    Download Script
  </Button>

</div>

          </div>

          <div className="whitespace-pre-wrap leading-8 text-zinc-200 text-lg">
            {result || "No script generated."}
          </div>

        </div>

      )}

      <div className="flex gap-4 mt-6">

  <button
    onClick={saveProject}
    className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 transition-all"
  >
    💾 Save Project
  </button>

</div>

<div className="mt-10 rounded-3xl border border-white/10 bg-black/40 p-8">

  <h2 className="text-4xl font-bold mb-6">
    🎥 AI B-Roll Ideas
  </h2>

  <div className="space-y-4">

    {brolls.map((broll, index) => (

      <div
        key={index}
        className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
      >
        {broll}
      </div>

    ))}

  </div>

</div>

      {titles.length > 0 && (

  <div className="max-w-6xl mx-auto mt-10">

    <h2 className="text-4xl font-black mb-6">
      Viral Titles 🔥
    </h2>

    <div className="grid gap-4">

      {titles.map((title, index) => (

        <div
          key={index}
          className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between"
        >

          <p className="text-lg font-semibold">
            {title}
          </p>

          <Button
            onClick={() =>
              navigator.clipboard.writeText(title)
            }
            className="bg-white text-black hover:bg-zinc-200"
          >
            Copy
          </Button>

        </div>

      ))}

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

<div className="mt-12 rounded-3xl border border-white/10 bg-black/40 p-8">
  
  <h2 className="text-4xl font-black mb-8">
    Viral Score Analysis 📈
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div className="bg-zinc-900 rounded-2xl p-6">
      <div className="flex justify-between mb-3">
        <span className="text-xl font-bold">Virality Score</span>
        <span className="text-pink-400 font-black">{viralScore}%</span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-4">
        <div
          className="bg-pink-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${viralScore}%` }}
        />
      </div>
    </div>

    <div className="bg-zinc-900 rounded-2xl p-6">
      <div className="flex justify-between mb-3">
        <span className="text-xl font-bold">Hook Strength</span>
        <span className="text-purple-400 font-black">{hookScore}%</span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-4">
        <div
          className="bg-purple-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${hookScore}%` }}
        />
      </div>
    </div>

    <div className="bg-zinc-900 rounded-2xl p-6">
      <div className="flex justify-between mb-3">
        <span className="text-xl font-bold">Emotion Trigger</span>
        <span className="text-orange-400 font-black">{emotionScore}%</span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-4">
        <div
          className="bg-orange-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${emotionScore}%` }}
        />
      </div>
    </div>

    <div className="bg-zinc-900 rounded-2xl p-6">
      <div className="flex justify-between mb-3">
        <span className="text-xl font-bold">Retention Power</span>
        <span className="text-cyan-400 font-black">{retentionScore}%</span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-4">
        <div
          className="bg-cyan-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${retentionScore}%` }}
        />
      </div>
    </div>

  </div>
</div>


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
  <div className="flex flex-wrap gap-3 mt-6">
  {[
    "MrBeast Challenge",
    "AI vs Humans",
    "Dark Motivation",
    "Luxury Lifestyle",
    "Anime Battle",
    "Fitness Transformation",
  ].map((idea) => (
    <button
      key={idea}
      onClick={() =>
        setThumbnailPrompt(idea)
      }
      className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-purple-600 transition-all"
    >
      {idea}
    </button>
  ))}
</div>
  <div className="flex gap-4 mt-4">
  {["16:9", "1:1", "9:16"].map((ratio) => (
    <button
      key={ratio}
      onClick={() => setAspectRatio(ratio)}
      className={`px-5 py-2 rounded-2xl border transition-all duration-300 ${
        aspectRatio === ratio
          ? "bg-purple-600 border-purple-600"
          : "border-white/10"
      }`}
    >
      {ratio}
    </button>
  ))}
</div>

  <Button
  onClick={generateThumbnail}
  disabled={thumbnailLoading}
  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-all duration-300 disabled:opacity-50"
>
  {thumbnailLoading ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Generating...
    </div>
  ) : (
    "🎨 Generate Thumbnail"
  )}
</Button>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
{thumbnails.map((image, index) => (
  <div
    key={index}
    className="rounded-3xl overflow-hidden border border-white/10 bg-black"
  >
    <div className="aspect-video">

    <img
  src={image}
  alt={`Thumbnail ${index}`}
  className="w-full rounded-2xl object-cover"
  style={{
    width: "100%",
    height: aspectRatio === "9:16" ? "500px" : "300px",
  }}
/>
      
    </div>

    <div className="p-4">
      <a
        href={
  image.startsWith("data:image")
    ? image
    : `data:image/jpeg;base64,${image}`
}
      >
        <Button className="w-full bg-white text-black hover:bg-zinc-200">
          Download HD Thumbnail
        </Button>
      </a>
    </div>
  </div>
))}
</div>

</div>

      {thumbnailHistory.length > 0 && (
  <div className="flex items-center justify-between mb-8">

  <h2 className="text-4xl font-black">
    Recent Thumbnails
  </h2>

  <Button
    onClick={() => {
      localStorage.removeItem(
        "thumbnailHistory"
      );
      setThumbnailHistory([]);
    }}
    className="bg-red-600 hover:bg-red-700"
  >
    Clear History
  </Button>

</div>
)}

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

      {projects.length > 0 && (

  <div className="flex items-center justify-between mb-8">

  <h2 className="text-4xl font-black">
    Saved Projects 📁
  </h2>

  <Button
    onClick={() => {
      localStorage.removeItem("projects");
      setProjects([]);
    }}
    className="bg-red-600 hover:bg-red-700"
  >
    Clear Projects
  </Button>

</div>
)}

<div className="mt-16">

  <h2 className="text-5xl font-bold mb-8">
    📂 Saved Projects
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {projects.map((project, index) => (

      <div
        key={index}
        className="rounded-3xl border border-white/10 bg-black/40 p-6"
      >

        <h3 className="text-2xl font-bold mb-3">
          {project.topic}
        </h3>

        <p className="text-zinc-400 mb-5">
          {project.style}
        </p>

        <button
          onClick={() => {

            setTopic(project.topic);
            setResult(project.result);
            setThumbnails(project.thumbnails || []);
            setBrolls(project.brolls || []);

          }}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700"
        >
          Open Project
        </button>

      </div>

    ))}

  </div>

</div>

    </main>
  );
}