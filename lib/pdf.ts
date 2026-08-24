// @ts-expect-error - pdf-parse v1.1.1 does not have built-in types
import pdfParse from "pdf-parse";

export interface PDFExtractionResult {
  text: string;
  numPages: number;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  let parsed;
  try {
    parsed = await pdfParse(buffer);
  } catch (err) {
    console.error("PDF parse error:", err);
    throw new Error("Failed to parse PDF. Please ensure the file is a valid, readable PDF document.");
  }

  const text = parsed.text?.trim() ?? "";
  if (!text) {
    throw new Error(
      "Could not extract any text from this PDF. It may be a scanned image or image-only PDF. " +
      "Please try a text-based PDF."
    );
  }

  return {
    text,
    numPages: parsed.numpages ?? 0,
  };
}
