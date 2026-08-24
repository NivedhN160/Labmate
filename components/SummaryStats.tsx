"use client";

import { motion } from "framer-motion";
import { User, Calendar, FlaskConical, AlertTriangle } from "lucide-react";
import { ReportData } from "@/lib/types";

interface SummaryStatsProps {
  data: ReportData;
}

export function SummaryStats({ data }: SummaryStatsProps) {
  const normalCount = data.results.filter((r) => r.status === "normal").length;
  const abnormalCount = data.results.length - normalCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 text-zinc-400 mb-4">
          <User className="w-5 h-5" />
          <span>Patient Info</span>
        </div>
        <div className="text-xl font-semibold mb-1">
          {data.patientInfo?.name || "Unknown Patient"}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Calendar className="w-4 h-4" />
          {data.patientInfo?.date || "Unknown Date"}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-2xl flex flex-col justify-center"
      >
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
          <FlaskConical className="w-5 h-5" />
          <span>Total Tests Analysed</span>
        </div>
        <div className="text-4xl font-bold">{data.results.length}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-2xl flex flex-col justify-center"
      >
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Needs Attention</span>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-4xl font-bold text-amber-400">{abnormalCount}</div>
          <div className="text-emerald-400 font-medium">{normalCount} Normal</div>
        </div>
      </motion.div>
    </div>
  );
}
