"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, FileText, Upload, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReportData } from "@/lib/types";
import { getAllReports, deleteReport, saveReport } from "@/lib/storage";
import { Disclaimer } from "@/components/Disclaimer";

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const router = useRouter();

  useEffect(() => {
    setReports(getAllReports());
  }, []);

  const handleDelete = (id: string) => {
    deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpen = (report: ReportData) => {
    saveReport(report);
    router.push(`/report/${report.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            ← Home
          </Link>
          <div className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Report History
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 transition-colors"
          >
            <Upload className="w-4 h-4" /> New Report
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-12 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Your Reports
        </motion.h1>

        {reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-zinc-500" />
            </div>
            <p className="text-zinc-400 mb-6">No reports yet.</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload Your First Report
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-zinc-600 transition-colors cursor-pointer"
                onClick={() => handleOpen(report)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{report.reportType || "Medical Report"}</div>
                    <div className="text-sm text-zinc-500 flex items-center gap-3 mt-0.5">
                      <span>{report.patientInfo?.name || "Unknown"}</span>
                      <span>·</span>
                      <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{report.results?.length ?? 0} tests</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(report.id);
                  }}
                  className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <div className="container mx-auto px-6 mt-20 max-w-4xl">
        <Disclaimer />
      </div>
    </div>
  );
}
