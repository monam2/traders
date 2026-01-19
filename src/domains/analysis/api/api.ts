import {
  Analysis,
  AnalysisStatus,
  Report,
} from "@/domains/analysis/entities/analysis";
import { createClient } from "@/shared/lib/supabase/client";

type ReportRow = {
  id: string;
  analysis_id: string;
  summary: string | null;
  chart_data: unknown[] | null;
  signals: unknown[] | null;
  recommendation: "BUY" | "SELL" | "HOLD" | null;
  created_at: string;
};

type AnalysisRow = {
  id: string;
  user_id: string;
  ticker: string;
  market: string;
  options: unknown[] | null;
  status: AnalysisStatus;
  created_at: string;
  updated_at: string;
  reports?: ReportRow[] | null;
};

const mapReport = (row: ReportRow): Report => ({
  id: row.id,
  analysisId: row.analysis_id,
  summary: row.summary,
  chartData: row.chart_data,
  signals: row.signals,
  recommendation: row.recommendation,
  createdAt: row.created_at,
});

const mapAnalysis = (row: AnalysisRow): Analysis => ({
  id: row.id,
  userId: row.user_id,
  ticker: row.ticker,
  market: row.market,
  options: Array.isArray(row.options) ? row.options : [],
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  report: row.reports?.[0] ? mapReport(row.reports[0]) : null,
});

export const getAnalysis = async (id: string): Promise<Analysis> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("analyses")
    .select(
      "id, user_id, ticker, market, options, status, created_at, updated_at, reports(id, analysis_id, summary, chart_data, signals, recommendation, created_at)",
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  console.log("getAnalysis fetch result:", data.status, data);
  return mapAnalysis(data as AnalysisRow);
};

import { apiClient, ApiResponse } from "@/shared/lib/api/client";

export const createAnalysis = async (ticker: string): Promise<string> => {
  // POST /api/analyze 호출
  const response = await apiClient
    .post("analyze", {
      json: { ticker },
    })
    .json<ApiResponse<{ id: string }>>();

  return response.data.id;
};
