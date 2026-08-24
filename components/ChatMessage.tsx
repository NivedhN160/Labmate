import { User, Sparkles } from "lucide-react";

export function ChatMessage({ message }: { message: { role: string; content: string } }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[85%] gap-3 p-4 rounded-2xl ${
          isUser
            ? "bg-emerald-500/10 border border-emerald-500/20 text-white rounded-tr-sm"
            : "glass-panel text-zinc-300 rounded-tl-sm"
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          )}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
