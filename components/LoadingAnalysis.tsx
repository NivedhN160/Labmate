"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Brain, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: FileText, label: "Extracting text from PDF…" },
  { icon: Brain, label: "Analysing with AI…" },
  { icon: CheckCircle2, label: "Structuring report…" },
];

export function LoadingAnalysis() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * 2500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Icon className="w-9 h-9 text-emerald-400" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-zinc-300 font-medium text-lg"
        >
          {current.label}
        </motion.p>
      </AnimatePresence>

      {/* Step dots */}
      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i <= step ? "bg-emerald-400" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
