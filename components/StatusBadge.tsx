import { ArrowUpCircle, ArrowDownCircle, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  status: "normal" | "high" | "low";
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = {
    high: {
      label: "High",
      className: "text-red-400 bg-red-500/10 border-red-500/20",
      Icon: ArrowUpCircle,
      iconClass: "text-red-400",
    },
    low: {
      label: "Low",
      className: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      Icon: ArrowDownCircle,
      iconClass: "text-amber-400",
    },
    normal: {
      label: "Normal",
      className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      Icon: CheckCircle2,
      iconClass: "text-emerald-400",
    },
  }[status];

  return (
    <div className="flex items-center gap-1.5">
      {showIcon && <config.Icon className={`w-4 h-4 ${config.iconClass}`} />}
      <span
        className={`text-xs px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${config.className}`}
      >
        {config.label}
      </span>
    </div>
  );
}
