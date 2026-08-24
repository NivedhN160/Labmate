"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Download, History } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReportData } from "@/lib/types";
import { getLatestReport } from "@/lib/storage";
import { SummaryStats } from "@/components/SummaryStats";
import { ReportCard } from "@/components/ReportCard";
import { ChatBox } from "@/components/ChatBox";
import { Disclaimer } from "@/components/Disclaimer";

export default function ReportPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const report = getLatestReport();
    if (report) {
      setData(report);
    } else {
      router.push("/upload");
    }
  }, [router]);

  const handleDownloadJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `labmate-report-${data.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-emerald-500 animate-ping" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/upload"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload New
          </Link>

          <div className="font-medium text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            {data.reportType || "Medical Report"}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/history"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-12 max-w-5xl">
        <SummaryStats data={data} />

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Detailed Analysis</h2>
          {data.results.map((result, idx) => (
            <ReportCard key={idx} result={result} index={idx} />
          ))}
        </div>

        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Ask about your report</h2>
          <ChatBox reportData={data} />
        </div>
      </main>

      <div className="container mx-auto px-6 mt-20 max-w-5xl">
        <Disclaimer />
      </div>
    </div>
  );
}
