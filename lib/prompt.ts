export function getAnalysisPrompt(pdfText: string): string {
  return `You are an expert medical data extractor.
Analyze the lab report and return ONLY valid JSON.

Schema (strict):
{
  "reportType": string,
  "patientInfo": { "name": string, "date": string },
  "results": [
    {
      "testName": string,
      "value": string,
      "unit": string,
      "referenceRange": string,
      "status": "normal" | "high" | "low",
      "explanation": string,
      "whyAbnormal": string,
      "suggestions": string[]
    }
  ]
}

Rules:
- Only extract the most important tests. Ignore headers, footers, page numbers, and repeated text.
- Use the reference range from the report to determine status.
- Suggestions must be lifestyle/dietary ONLY — never recommend medications.
- whyAbnormal must be "" when status is "normal".

Lab report text:
${pdfText}`;
}
