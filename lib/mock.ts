export function getMockData() {
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
