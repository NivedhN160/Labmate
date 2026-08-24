# Labmate · Lab Report Reader

Labmate is an AI-powered medical report reader that extracts key metrics from your lab reports and explains them in simple, plain English with natural lifestyle recommendations.

🔗 **[Live Demo](https://medial-report-reader.vercel.app/)** *(Update with actual live URL if different)*

> **⚠️ Disclaimer:** This tool provides general educational information based on AI analysis. It is not medical advice, diagnosis, or treatment. Always consult a qualified doctor before making any health decisions.

## Features

- **Upload PDF:** Securely upload your blood tests, lipid panels, or other medical reports.
- **Extract Text:** Automatically extracts text from the PDF (Note: PDF must be text-searchable. Scanned images without OCR will not work).
- **Groq Structured Extraction:** Uses open-source models via Groq (like Llama 3.1 and GPT-OSS) to parse the text and structure the data.
- **Report UI:** Beautiful, easy-to-read interface showing status (high/low/normal) and lifestyle-only suggestions.

## Tech Stack

| Technology | Description |
|------------|-------------|
| **Next.js 16** | React framework (App Router) |
| **pdf-parse** | Extracts text from PDF files |
| **Groq AI** | Blazing fast AI inference for structured extraction (using Llama 3.1 / GPT-OSS) |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | For potential future data visualization |
| **Framer Motion** | UI animations |

## Getting Started

### Local Run

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables by copying the example file and adding your Groq API key:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Without a valid `GROQ_API_KEY`, the application will return **mock data** for testing the UI.*

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The application follows a simple flow:
1. `upload` -> User uploads a PDF.
2. `POST /api/parse-pdf` -> The backend parses the PDF text (using `pdfText.substring(0, 10000)` to stay within AI context limits) and sends it to the Groq API for structured extraction.
3. `report/[id]` -> The structured data is presented to the user.
