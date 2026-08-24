export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`border-t border-white/10 pt-8 text-center text-zinc-500 text-sm ${className}`}
    >
      <p>
        ⚠️ <strong className="text-zinc-400">Disclaimer:</strong> This tool provides general
        educational information based on AI analysis. It is{" "}
        <strong className="text-zinc-400">not</strong> medical advice, diagnosis, or treatment.
        Always consult a qualified doctor before making any health decisions.
      </p>
    </footer>
  );
}
