export function getAnalysisPrompt(pdfText: string) {
  return `
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
}
