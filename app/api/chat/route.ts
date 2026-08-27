import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { retrieveRelevantChunks } from "@/lib/rag/retriever";
import { getRagChatPrompt } from "@/lib/prompt";

const MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "qwen/qwen3.6-27b",
  "groq/compound-mini",
];

function isModelError(err: any): boolean {
  const msg: string =
    err?.message ?? err?.error?.message ?? err?.error?.error?.message ?? "";
  return (
    msg.includes("model") &&
    (msg.includes("does not exist") ||
      msg.includes("not found") ||
      msg.includes("decommissioned") ||
      msg.includes("access") ||
      msg.includes("unavailable"))
  );
}

export async function POST(request: Request) {
  try {
    const { question, rawText, structuredResults, history } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Mock response if no API key is present
      return NextResponse.json({ reply: "This is a mock response because no API key is provided. You asked: " + question });
    }

    const groq = new Groq({ apiKey });

    // Build context with RAG
    let relevantChunks: string[] = [];
    if (rawText) {
      relevantChunks = await retrieveRelevantChunks(rawText, question, 4);
    }
    
    // Combine structured results string as a base chunk
    const structuredContext = `Structured Results:\n${JSON.stringify(structuredResults)}`;
    relevantChunks.push(structuredContext);

    // Build the system prompt
    const systemPrompt = getRagChatPrompt(relevantChunks, question);

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: question },
    ];

    let lastError = null;

    for (const model of MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          messages: messages as any,
          model,
          temperature: 0.2,
          max_tokens: 2000,
        });

        const reply = completion.choices[0]?.message?.content || "";
        return NextResponse.json({ reply });
      } catch (err: any) {
        lastError = err;
        console.error(`Chat API - Model ${model} failed:`, err?.message);

        const errorMessage = err?.message ?? "";
        if (
          errorMessage.includes("Request too large") ||
          errorMessage.includes("tokens per minute") ||
          errorMessage.includes("rate_limit_exceeded") ||
          err?.status === 413
        ) {
          return NextResponse.json(
            { error: "The lab report is too long for free analysis. Please try again later." },
            { status: 413 }
          );
        }

        if (isModelError(err)) {
          continue;
        }
        break; // Stop on non-model errors
      }
    }

    if (isModelError(lastError)) {
      return NextResponse.json(
        { error: "The AI model is currently unavailable. Please try again later." },
        { status: 503 }
      );
    }

    throw lastError || new Error("Failed to generate a response.");
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing your question. Please try again." },
      { status: 500 }
    );
  }
}
