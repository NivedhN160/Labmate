import { NextResponse } from "next/server";
// @ts-expect-error - pdf-parse v1.1.1 does not have built-in types
import pdfParse from "pdf-parse";
import { Groq } from "groq-sdk";

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

    const prompt = `
You are an expert medical data extractor and health assistant.
Analyze the following text extracted from a medical report.

Extract all the key tests and their values. For each test, provide:
1. "testName": The name of the test
2. "value": The numerical or string value
3. "unit": The unit of measurement (if any)
4. "referenceRange": The normal reference range (if any)
5. "status": Determine if it is "normal", "high", or "low" based on the reference range
6. "explanation": A plain-english explanation of what this test means
7. "whyAbnormal": If status is "high" or "low", explain common natural/lifestyle causes. Otherwise, leave empty.
8. "suggestions": If status is "high" or "low", provide specific natural lifestyle/dietary advice (NO medications). Otherwise, provide general wellness tips related to this test.

Also, determine the "reportType" (e.g., "Complete Blood Count", "Lipid Panel", etc.).
Return ONLY valid JSON in the following format, with no markdown code blocks wrapping it:
{
  "reportType": "Report Type",
  "patientInfo": {
    "name": "Extracted or Unknown",
    "date": "Extracted or Unknown"
  },
  "results": [
    {
      "testName": "Hemoglobin",
      "value": "11.2",
      "unit": "g/dL",
      "referenceRange": "12.0 - 15.5",
      "status": "low",
      "explanation": "Protein in red blood cells that carries oxygen.",
      "whyAbnormal": "Low levels can indicate anemia, often due to iron deficiency or poor diet.",
      "suggestions": ["Eat iron-rich foods like spinach and red meat", "Take vitamin C to boost iron absorption"]
    }
  ]
}

Medical Report Text:
${pdfText.substring(0, 10000)}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B
      temperature: 0.1,
    });

    let aiResponseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Clean up potential markdown formatting (e.g. ```json ... ```)
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const reportData = JSON.parse(aiResponseText);

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

function getMockData() {
  return {
    id: "mock-report-123",
    timestamp: new Date().toISOString(),
    reportType: "Lipid Panel & CBC (Mock)",
    patientInfo: {
      name: "John Doe",
      date: "May 8, 2026"
    },
    results: [
      {
        testName: "Hemoglobin",
        value: "14.2",
        unit: "g/dL",
        referenceRange: "13.8 - 17.2",
        status: "normal",
        explanation: "Hemoglobin is the protein in your red blood cells that carries oxygen to your body's organs and tissues.",
        whyAbnormal: "",
        suggestions: ["Maintain a balanced diet rich in iron to keep levels healthy.", "Stay hydrated."]
      },
      {
        testName: "LDL Cholesterol",
        value: "155",
        unit: "mg/dL",
        referenceRange: "< 100",
        status: "high",
        explanation: "Often called 'bad' cholesterol because it collects in the walls of your blood vessels.",
        whyAbnormal: "High LDL is often linked to a diet high in saturated fats, lack of exercise, or high stress.",
        suggestions: ["Increase intake of soluble fiber (oats, beans, fruits).", "Incorporate at least 30 mins of moderate cardio 5 times a week.", "Avoid trans fats found in processed foods."]
      },
      {
        testName: "Vitamin D",
        value: "18",
        unit: "ng/mL",
        referenceRange: "20 - 50",
        status: "low",
        explanation: "Crucial nutrient that helps your body absorb calcium and keeps bones strong.",
        whyAbnormal: "Lack of sun exposure and inadequate dietary intake are common causes.",
        suggestions: ["Spend 15-20 minutes in the morning sun daily.", "Eat more fatty fish like salmon or fortified foods.", "Consider discussing a vitamin D supplement with your doctor if diet isn't enough."]
      }
    ]
  };
}
