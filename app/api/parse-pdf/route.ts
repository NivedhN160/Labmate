import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf";
import { analyzeLabReport } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a valid PDF file." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB." },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let pdfText: string;
    try {
      const result = await extractTextFromPDF(buffer);
      pdfText = result.text;
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Analyse with Groq (includes Zod validation + retry)
    let reportData;
    try {
      reportData = await analyzeLabReport(pdfText);
    } catch (err: any) {
      console.error("Groq analysis failed:", err);
      return NextResponse.json(
        { error: err.message ?? "Failed to analyse the report. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(reportData);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
