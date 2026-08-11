import { NextResponse } from "next/server";
// @ts-expect-error - pdf-parse v1.1.1 does not have built-in types
import pdfParse from "pdf-parse";
import { Groq } from "groq-sdk";
import { getMockData } from "@/lib/mock";
import { getAnalysisPrompt } from "@/lib/prompt";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
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

    // Read the file as an array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF text
    let pdfText = "";
    try {
      const parsed = await pdfParse(buffer);
      pdfText = parsed.text;
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse PDF text. Please ensure it is a readable document." },
        { status: 500 }
      );
    }

    if (!pdfText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the PDF. It might be a scanned image." },
        { status: 400 }
      );
    }

    // Now, send this text to the AI layer
    // For this implementation, we will use Groq API using a free model like Llama-3-8b-8192 or mixtral-8x7b-32768
    // If the API key is missing, we will return mock data for testing UI
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      console.warn("GROQ_API_KEY is missing. Returning mock data.");
      return NextResponse.json(getMockData());
    }

    const groq = new Groq({ apiKey: groqApiKey });

    const prompt = getAnalysisPrompt(pdfText);

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B
      temperature: 0.1,
    });

    let aiResponseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Clean up potential markdown formatting (e.g. ```json ... ```)
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let reportData;
    try {
      reportData = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("Failed to parse AI JSON response:", aiResponseText);
      return NextResponse.json(
        { error: "Failed to parse the report data from the AI response. Please try again." },
        { status: 500 }
      );
    }

    // Add a unique ID and timestamp to the response
    const finalData = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...reportData
    };

    return NextResponse.json(finalData);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
