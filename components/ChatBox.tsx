"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ReportData } from "@/lib/types";

const SUGGESTIONS = [
  "What do my overall results mean?",
  "Are there any critical abnormalities?",
  "How can I naturally improve my high values?",
];

export function ChatBox({ reportData }: { reportData: ReportData }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          rawText: reportData.rawText,
          structuredResults: reportData.results,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to get an answer.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[500px] border border-white/10 overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between z-10 shrink-0">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Ask Labmate AI
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm">
              I've analyzed your report. Ask me any questions about your results, what they mean, or how to improve them naturally.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-zinc-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <ChatMessage key={i} message={m} />)
        )}
        
        {isLoading && (
          <div className="flex w-full justify-start">
             <div className="glass-panel p-4 rounded-2xl rounded-tl-sm text-zinc-400 flex items-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
             </div>
          </div>
        )}

        {error && (
          <div className="flex w-full justify-center">
             <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-2 text-red-400 text-sm max-w-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
             </div>
          </div>
        )}

        <div ref={endRef} className="shrink-0" />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-zinc-900/50 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-1.5 rounded-lg bg-emerald-500 text-zinc-950 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
