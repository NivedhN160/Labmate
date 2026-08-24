import { Groq } from "groq-sdk";
import { getMockData } from "./mock";
import { getAnalysisPrompt } from "./prompt";
import { ReportDataSchema } from "./schemas";
import { ReportData } from "./types";

// Model fallback chain — all free tier, no charges
const MODELS = [
  "openai/gpt-oss-20b",        // fast
  "openai/gpt-oss-120b",       // better quality
  "qwen/qwen3.6-27b",          // good alternative
  "groq/compound-mini",        // higher TPM limit (70k)
];

function cleanJSON(raw: string): string {
  return raw.replace(/```json/g, "").replace(/```/g, "").trim();
}

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

async function callModel(groq: Groq, model: string, pdfText: string): Promise<string> {
  const MAX_PDF_CHARS = 5500;
  const truncatedText = pdfText.slice(0, MAX_PDF_CHARS);
  const prompt = getAnalysisPrompt(truncatedText);
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model,
    temperature: 0.1,
    max_tokens: 4000, // Reduced to fit within 8000 TPM (Input Tokens + max_tokens)
  });
  return completion.choices[0]?.message?.content ?? "{}";
}

export async function analyzeLabReport(pdfText: string): Promise<ReportData> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("GROQ_API_KEY missing — returning mock data.");
    return getMockData();
  }

  const groq = new Groq({ apiKey });

  let lastError: Error | null = null;

  // Try each model in the fallback chain
  for (const model of MODELS) {
    console.log(`Trying model: ${model}`);
    try {
      const raw = await callModel(groq, model, pdfText);
      const cleaned = cleanJSON(raw);
      const parsed = JSON.parse(cleaned);

      // Validate with Zod
      const validated = ReportDataSchema.parse(parsed);

      return {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        rawText: pdfText,
        ...validated,
      } as ReportData;
    } catch (err: any) {
      lastError = err;
      console.error(`Model ${model} failed:`, err?.message ?? err);

      const errorMessage = err?.message ?? "";
      if (
        errorMessage.includes("Request too large") ||
        errorMessage.includes("tokens per minute") ||
        errorMessage.includes("rate_limit_exceeded") ||
        err?.status === 413
      ) {
        throw new Error(
          "The lab report is too long for free analysis. Please upload a shorter report or try again later."
        );
      }

      if (isModelError(err)) {
        // Model unavailable — try next in chain
        console.warn(`Model ${model} is unavailable, trying next fallback...`);
        continue;
      }

      // Non-model error (e.g. bad JSON, Zod validation) — retry same model once
      try {
        console.log(`Retrying model ${model} once...`);
        await new Promise((r) => setTimeout(r, 1500));
        const raw = await callModel(groq, model, pdfText);
        const cleaned = cleanJSON(raw);
        const parsed = JSON.parse(cleaned);
        const validated = ReportDataSchema.parse(parsed);
        return {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          rawText: pdfText,
          ...validated,
        } as ReportData;
      } catch (retryErr: any) {
        lastError = retryErr;
        console.error(`Retry for model ${model} also failed:`, retryErr?.message);
        // Move to next model
        continue;
      }
    }
  }

  // All models failed — surface clean error
  if (isModelError(lastError)) {
    throw new Error(
      "The AI model is currently unavailable. Please try again later or contact support."
    );
  }

  throw new Error(
    lastError?.message ?? "Failed to analyze the lab report. Please try again."
  );
}
