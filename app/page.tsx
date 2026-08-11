"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Activity, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMockData } from "@/lib/mock";

export default function Home() {
  const router = useRouter();

  const handleMock = () => {
    localStorage.setItem("latestReport", JSON.stringify(getMockData()));
    router.push("/report/mock");
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950 flex flex-col justify-center">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-8"
        >
          <img src="/icon-512x512.png" alt="LabMate Logo" className="w-24 h-24 mb-6 rounded-2xl shadow-2xl shadow-emerald-500/20" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-emerald-500/20">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-400">AI-Powered Health Insights</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white max-w-4xl"
        >
          Understand Your Medical Reports in <span className="text-gradient">Plain English</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed"
        >
          Upload your blood tests, lipid panels, or other medical reports. Get instant, easy-to-understand explanations and natural lifestyle recommendations—no medical jargon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <Link href="/upload">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group">
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Upload Report
            </button>
          </Link>
          <button onClick={handleMock} className="w-full sm:w-auto px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            View Sample Report
          </button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-5xl"
          id="features"
        >
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Smart Parsing</h3>
            <p className="text-zinc-400">Automatically extracts key metrics and values from any standard lab report PDF.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Abnormality Detection</h3>
            <p className="text-zinc-400">Highlights high and low values instantly, explaining exactly what they mean for your body.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Natural Guidance</h3>
            <p className="text-zinc-400">Provides dietary, sleep, and lifestyle advice to improve your levels safely and naturally.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
