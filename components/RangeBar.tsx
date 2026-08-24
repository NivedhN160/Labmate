interface RangeBarProps {
  value: string;
  referenceRange: string;
  status: "normal" | "high" | "low";
}

function parseNumber(str: string): number | null {
  const n = parseFloat(str.replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? null : n;
}

function parseRange(range: string): { min: number | null; max: number | null } {
  // Handles "12.0 - 15.5", "< 100", "> 40", "70-100"
  const ltMatch = range.match(/^[<≤]\s*([\d.]+)/);
  const gtMatch = range.match(/^[>≥]\s*([\d.]+)/);
  const rangeMatch = range.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);

  if (ltMatch) return { min: null, max: parseFloat(ltMatch[1]) };
  if (gtMatch) return { min: parseFloat(gtMatch[1]), max: null };
  if (rangeMatch)
    return { min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[2]) };
  return { min: null, max: null };
}

export function RangeBar({ value, referenceRange, status }: RangeBarProps) {
  const val = parseNumber(value);
  const { min, max } = parseRange(referenceRange);

  if (val === null || (min === null && max === null)) return null;

  // Build a display range with 20% padding on each side
  const lo = min ?? (max! * 0.5);
  const hi = max ?? (min! * 1.5);
  const span = hi - lo;
  if (span <= 0) return null;

  const extLo = lo - span * 0.2;
  const extHi = hi + span * 0.2;
  const totalSpan = extHi - extLo;

  const valuePct = Math.max(0, Math.min(100, ((val - extLo) / totalSpan) * 100));
  const minPct = ((lo - extLo) / totalSpan) * 100;
  const maxPct = ((hi - extLo) / totalSpan) * 100;

  const dotColor =
    status === "high" ? "bg-red-400" : status === "low" ? "bg-amber-400" : "bg-emerald-400";

  return (
    <div className="mt-3 mb-1">
      <div className="relative h-2 rounded-full bg-zinc-800">
        {/* Normal zone */}
        <div
          className="absolute h-full rounded-full bg-emerald-500/20"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Value dot */}
        <div
          className={`absolute w-3 h-3 rounded-full -top-0.5 -translate-x-1/2 border-2 border-zinc-950 ${dotColor}`}
          style={{ left: `${valuePct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-600 mt-1">
        {min !== null && <span>Min {min}</span>}
        {max !== null && <span className="ml-auto">Max {max}</span>}
      </div>
    </div>
  );
}
