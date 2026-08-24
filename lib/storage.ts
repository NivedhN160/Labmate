import { ReportData } from "./types";

const STORAGE_KEY = "labmate_reports";
const LATEST_KEY = "latestReport";

function getAll(): ReportData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReportData[];
  } catch {
    return [];
  }
}

export function saveReport(report: ReportData): void {
  if (typeof window === "undefined") return;
  const all = getAll();
  // Put newest first, deduplicate by id
  const filtered = all.filter((r) => r.id !== report.id);
  const updated = [report, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  localStorage.setItem(LATEST_KEY, JSON.stringify(report));
}

export function getLatestReport(): ReportData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LATEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReportData;
  } catch {
    return null;
  }
}

export function getAllReports(): ReportData[] {
  return getAll();
}

export function deleteReport(id: string): void {
  if (typeof window === "undefined") return;
  const updated = getAll().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // If deleted report was the latest, clear it too
  try {
    const latest = getLatestReport();
    if (latest?.id === id) {
      localStorage.removeItem(LATEST_KEY);
    }
  } catch {
    // ignore
  }
}
