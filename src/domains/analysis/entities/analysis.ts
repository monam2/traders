export enum AnalysisStatus {
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

export type AnalysisRequest = {
  ticker: string;
  market?: string;
  options?: unknown[];
};

export type Report = {
  id: string;
  analysisId: string;
  summary: string | null;
  chartData: unknown[] | null;
  signals: unknown[] | null;
  recommendation: "BUY" | "SELL" | "HOLD" | null;
  createdAt: string;
};

export type Analysis = {
  id: string;
  userId: string;
  ticker: string;
  market: string;
  options: unknown[];
  status: AnalysisStatus;
  createdAt: string;
  updatedAt: string;
  report?: Report | null;
};
