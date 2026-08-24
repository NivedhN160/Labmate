export interface TestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low";
  explanation: string;
  whyAbnormal: string;
  suggestions: string[];
  confidence?: number;
  notes?: string;
}

export interface ReportData {
  id: string;
  timestamp: string;
  reportType: string;
  patientInfo: {
    name: string;
    date: string;
  };
  results: TestResult[];
  rawText?: string;
}
