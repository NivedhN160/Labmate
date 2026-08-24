"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, File, X, AlertCircle, CheckCircle2, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMockData } from "@/lib/mock";
import { saveReport } from "@/lib/storage";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { Disclaimer } from "@/components/Disclaimer";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleMock = () => {
    const mock = getMockData();
    saveReport(mock);
    router.push("/report/mock");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Surface the specific error from the API (e.g. scanned PDF)
        throw new Error(data.error || "Failed to process the report. Please try again.");
      }

      saveReport(data);
      router.push(`/report/${data.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <LoadingAnalysis />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-6 flex flex-col items-center">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <Link
        href="/"
        className="absolute top-8 left-8 text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to Home
      </Link>

      <Link
        href="/history"
        className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors text-sm"
      >
        History →
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center mb-12 relative z-10"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Upload Your Report</h1>
        <p className="text-zinc-400">
          Securely upload your medical report PDF. Your data is processed locally and never shared
          with third parties.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div
          className={`glass-panel rounded-3xl p-10 border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]
            ${isDragging ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-700 hover:border-zinc-500"}
            ${file ? "border-solid border-emerald-500/50" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleFileSelect}
          />

          {!file ? (
            <>
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Drag & Drop your PDF</h3>
              <p className="text-zinc-400 text-sm mb-6">or click to browse from your device</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Max 10MB
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Text-based PDF only
                </span>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <File className="w-8 h-8" />
              </div>
              <p className="text-white font-medium mb-1 truncate max-w-[80%]">{file.name}</p>
              <p className="text-zinc-500 text-sm mb-6">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="px-6 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 transition-colors flex items-center gap-2 text-sm"
                >
                  Analyze Report <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleMock}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Try a Sample Report Instead
          </button>
        </div>

        <Disclaimer className="mt-10" />
      </motion.div>
    </div>
  );
}
