export function getAnalysisPrompt(pdfText: string): string {
  return `You are an expert medical data extractor and health assistant.
Analyze the text extracted from a lab report and return ONLY valid JSON — no markdown, no explanation.

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
      "whyAbnormal": string,       // empty string if status is "normal"
      "suggestions": string[]      // lifestyle/dietary only, NO medications
    }
  ]
}

Few-shot examples of how lab report text maps to JSON:

Example A (input fragment):
  Haemoglobin: 11.2 g/dL (ref 13.8-17.2)
→ { "testName": "Haemoglobin", "value": "11.2", "unit": "g/dL", "referenceRange": "13.8 - 17.2", "status": "low", "explanation": "Haemoglobin carries oxygen in red blood cells.", "whyAbnormal": "Low haemoglobin can result from iron-deficiency anaemia, poor diet, or blood loss.", "suggestions": ["Eat iron-rich foods like lentils and spinach", "Add vitamin C to meals to boost iron absorption", "Avoid tea/coffee right after meals"] }

Example B (input fragment):
  Fasting Blood Sugar: 92 mg/dL (ref 70-100)
→ { "testName": "Fasting Blood Sugar", "value": "92", "unit": "mg/dL", "referenceRange": "70 - 100", "status": "normal", "explanation": "Measures blood glucose after a period of fasting.", "whyAbnormal": "", "suggestions": ["Maintain a balanced diet low in refined sugars", "Exercise regularly to keep blood sugar stable"] }

Rules:
- Use the reference range from the report to determine status. If no range is given, use standard clinical norms.
- Suggestions must be lifestyle/dietary ONLY — never recommend medications.
- whyAbnormal must be empty string ("") when status is "normal".
- Return ALL tests found in the report.
- Use at most ${pdfText.substring(0, 10000).length} characters of report text (already capped).

Lab report text:
${pdfText.substring(0, 10000)}`;
}
