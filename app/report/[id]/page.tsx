"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowDownCircle, ArrowUpCircle, User, Calendar, FileText, ArrowLeft, Download, Info } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Defining types based on our API response
interface TestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low";
  explanation: string;
  whyAbnormal: string;
  suggestions: string[];
}

interface ReportData {
  id: string;
  timestamp: string;
  reportType: string;
  patientInfo: {
    name: string;
    date: string;
  };
  results: TestResult[];
}

export default function ReportPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // In MVP, we are storing the parsed report in localStorage
    const savedData = localStorage.getItem("latestReport");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
      } catch (e) {
        console.error("Failed to parse saved report", e);
      }
    } else {
      router.push("/upload");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-emerald-500 animate-ping" />
      </div>
    );
  }

  const normalCount = data.results.filter(r => r.status === "normal").length;
  const abnormalCount = data.results.length - normalCount;

  const getStatusColor = (status: string) => {
    if (status === "high") return "text-red-400 bg-red-500/10 border-red-500/20";
    if (status === "low") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  };

  const getStatusIcon = (status: string) => {
    if (status === "high") return <ArrowUpCircle className="w-5 h-5 text-red-400" />;
    if (status === "low") return <ArrowDownCircle className="w-5 h-5 text-amber-400" />;
    return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Background elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/upload" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Upload New
          </Link>
          <div className="font-medium text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            {data.reportType || "Medical Report"}
          </div>
          <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            Save PDF
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-12 max-w-5xl">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-zinc-400 mb-4">
              <User className="w-5 h-5" />
              <span>Patient Info</span>
            </div>
            <div className="text-xl font-semibold mb-1">{data.patientInfo?.name || "Unknown Patient"}</div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Calendar className="w-4 h-4" /> {data.patientInfo?.date || "Unknown Date"}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl flex flex-col justify-center">
            <div className="text-zinc-400 mb-2">Total Tests Analysed</div>
            <div className="text-4xl font-bold">{data.results.length}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl flex flex-col justify-center">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-zinc-400 mb-2">Needs Attention</div>
                <div className="text-4xl font-bold text-amber-400">{abnormalCount}</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-medium">{normalCount} Normal</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            Detailed Analysis
          </h2>

          {data.results.map((result, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className={`rounded-2xl p-6 border-l-4 ${result.status === 'normal' ? 'bg-zinc-900/50 border-emerald-500' : result.status === 'high' ? 'bg-red-500/5 border-red-500' : 'bg-amber-500/5 border-amber-500'}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Left side: Test Info & Values */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(result.status)}
                    <h3 className="text-xl font-bold">{result.testName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border uppercase tracking-wider font-semibold ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">{result.value}</span>
                    <span className="text-zinc-400">{result.unit}</span>
                    <span className="text-zinc-500 text-sm ml-4 border-l border-zinc-700 pl-4">Range: {result.referenceRange}</span>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    {result.explanation}
                  </p>

                  {result.status !== "normal" && result.whyAbnormal && (
                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-zinc-300"><strong className="text-white">Why it might be {result.status}:</strong> {result.whyAbnormal}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side: Actionable Suggestions */}
                <div className="md:w-1/3 bg-black/40 rounded-xl p-5 border border-white/5">
                  <h4 className="font-medium flex items-center gap-2 mb-4 text-sm text-zinc-300">
                    <Info className="w-4 h-4 text-emerald-400" />
                    Natural Improvements
                  </h4>
                  <ul className="space-y-3">
                    {result.suggestions.map((suggestion, sIdx) => (
                      <li key={sIdx} className="text-sm text-zinc-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </main>
      
      {/* Disclaimer Footer */}
      <footer className="container mx-auto px-6 mt-20 border-t border-white/10 pt-8 text-center text-zinc-500 text-sm">
        <p>⚠️ <strong>Disclaimer:</strong> This tool provides general educational information based on AI analysis. It is not medical advice, diagnosis, or treatment. Always consult a qualified doctor before making any health decisions.</p>
      </footer>
    </div>
  );
}
