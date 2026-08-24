"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";
import { TestResult } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { RangeBar } from "./RangeBar";

interface ReportCardProps {
  result: TestResult;
  index: number;
}

export function ReportCard({ result, index }: ReportCardProps) {
  const borderColor =
    result.status === "normal"
      ? "border-emerald-500"
      : result.status === "high"
      ? "border-red-500"
      : "border-amber-500";

  const bgColor =
    result.status === "normal"
      ? "bg-zinc-900/50"
      : result.status === "high"
      ? "bg-red-500/5"
      : "bg-amber-500/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className={`rounded-2xl p-6 border-l-4 ${borderColor} ${bgColor}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: Test info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{result.testName}</h3>
            <StatusBadge status={result.status} />
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">{result.value}</span>
            <span className="text-zinc-400">{result.unit}</span>
            <span className="text-zinc-500 text-sm ml-4 border-l border-zinc-700 pl-4">
              Range: {result.referenceRange}
            </span>
          </div>

          <RangeBar
            value={result.value}
            referenceRange={result.referenceRange}
            status={result.status}
          />

          <p className="text-zinc-300 text-sm leading-relaxed mt-3">{result.explanation}</p>

          {result.status !== "normal" && result.whyAbnormal && (
            <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-zinc-300">
                  <strong className="text-white">Why it might be {result.status}:</strong>{" "}
                  {result.whyAbnormal}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Suggestions */}
        <div className="md:w-1/3 bg-black/40 rounded-xl p-5 border border-white/5 shrink-0">
          <h4 className="font-medium flex items-center gap-2 mb-4 text-sm text-zinc-300">
            <Info className="w-4 h-4 text-emerald-400" />
            Natural Improvements
          </h4>
          <ul className="space-y-3">
            {result.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span className="leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
