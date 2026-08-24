import { z } from "zod";

export const TestResultSchema = z.object({
  testName: z.string(),
  value: z.string(),
  unit: z.string(),
  referenceRange: z.string(),
  status: z.enum(["normal", "high", "low"]),
  explanation: z.string(),
  whyAbnormal: z.string(),
  suggestions: z.array(z.string()),
  confidence: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
});

export const ReportDataSchema = z.object({
  reportType: z.string(),
  patientInfo: z.object({
    name: z.string(),
    date: z.string(),
  }),
  results: z.array(TestResultSchema),
});

export type TestResultInput = z.input<typeof TestResultSchema>;
export type ReportDataInput = z.input<typeof ReportDataSchema>;
