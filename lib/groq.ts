import { Groq } from "groq-sdk";
import { getMockData } from "./mock";
import { getAnalysisPrompt } from "./prompt";
import { ReportDataSchema } from "./schemas";
import { ReportData } from "./types";

const MAX_RETRIES = 2;

async function callGroq(groq: Groq, pdfText: string): Promise<string> {
  const prompt = getAnalysisPrompt(pdfText);
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
  });
  return completion.choices[0]?.message?.content ?? "{}";
}

function cleanJSON(raw: string): string {
  return raw.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function analyzeLabReport(pdfText: string): Promise<ReportData> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("GROQ_API_KEY missing — returning mock data.");
    return getMockData();
  }

  const groq = new Groq({ apiKey });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callGroq(groq, pdfText);
      const cleaned = cleanJSON(raw);
      const parsed = JSON.parse(cleaned);

      // Validate with Zod
      const validated = ReportDataSchema.parse(parsed);

      return {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...validated,
      } as ReportData;
    } catch (err: any) {
      lastError = err;
      console.error(`analyzeLabReport attempt ${attempt + 1} failed:`, err?.message ?? err);
      if (attempt < MAX_RETRIES) {
        // Short back-off before retry
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw new Error(
    lastError?.message ?? "Failed to analyze the lab report after multiple attempts."
  );
}
