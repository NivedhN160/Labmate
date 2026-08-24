import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

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

    // Build the system prompt
    const systemPrompt = `You are a helpful AI health assistant for 'Labmate'.
You are analyzing a patient's lab report.
Answer their questions about their results in plain, easy-to-understand English.

CRITICAL RULES:
1. ONLY provide lifestyle, diet, exercise, or sleep recommendations.
2. NEVER recommend medications, supplements, or specific treatments.
3. ALWAYS remind the user to consult a doctor for medical advice.
4. Base your answers on the provided lab report text and structured data.
5. Keep answers concise, empathetic and friendly.`;

    const dataContext = `
--- LAB REPORT DATA ---
Structured Results: ${JSON.stringify(structuredResults)}
Extracted Text:
${rawText?.substring(0, 10000) || "No raw text available."}
-----------------------`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: dataContext },
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
          max_tokens: 2048,
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
