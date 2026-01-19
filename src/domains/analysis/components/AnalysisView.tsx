"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Progress } from "@/shared/components/ui/progress";
import { useAnalysis } from "@/domains/analysis/hooks/useAnalysis";
import { Analysis, AnalysisStatus } from "@/domains/analysis/entities/analysis";
import { useAnalysisRealtime } from "@/domains/analysis/hooks/useAnalysisRealtime";
import { AnalysisChart } from "./AnalysisChart";

function AnalysisView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  // Realtime hook returns progress state
  const { progress, message } = useAnalysisRealtime(id);
  const { data } = useAnalysis(id);

  return (
    <>
      {(() => {
        switch (data.status) {
          case AnalysisStatus.Processing:
            return (
              <ProcessingView
                progress={progress}
                message={message}
                ticker={data.ticker}
              />
            );
          case AnalysisStatus.Failed:
            return <FailedView />;
          case AnalysisStatus.Completed:
            return <CompletedView analysis={data} />;
          default:
            return <UnknownView />;
        }
      })()}
    </>
  );
}

function ProcessingView({
  progress,
  message,
  ticker,
}: {
  progress: number;
  message: string;
  ticker: string;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">AI Analysis for {ticker}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
        {/* Skeleton UI Mimicking the Report */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-[200px] w-full bg-accent/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FailedView() {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">분석에 실패했습니다.</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        다시 시도해주세요. 문제가 지속되면 관리자에게 문의하세요.
      </CardContent>
    </Card>
  );
}

function CompletedView({ analysis }: { analysis: Analysis }) {
  const report = analysis.report;

  if (!report) return <UnknownView />;

  const chartData =
    (report.chartData as { time: string; value: number }[]) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {analysis.ticker}
                <span className="text-sm font-normal text-muted-foreground">
                  Analysis Report
                </span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
            <RecommendationBadge type={report.recommendation || "HOLD"} />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Summary Section */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">
              📋 투자 요약
            </h3>
            <p className="text-base leading-relaxed text-foreground/90">
              {report.summary}
            </p>
          </section>

          {/* Signals Grid */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">
              🔑 핵심 시그널
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {typeof report.signals === "object" &&
              report.signals !== null &&
              Array.isArray(report.signals)
                ? (report.signals as string[]).map(
                    (signal: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-secondary/50 border border-border/50 flex flex-col items-center justify-center text-center hover:bg-secondary transition-colors"
                      >
                        <span className="font-medium text-sm text-primary">
                          {signal}
                        </span>
                      </div>
                    ),
                  )
                : null}
            </div>
          </section>

          {/* Chart Section */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold border-b pb-2">
              📉 주가 추세 예측
            </h3>
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <AnalysisChart
                data={chartData}
                colors={{
                  lineColor:
                    report.recommendation === "BUY"
                      ? "#22c55e"
                      : report.recommendation === "SELL"
                        ? "#ef4444"
                        : "#3b82f6",
                  areaTopColor:
                    report.recommendation === "BUY"
                      ? "rgba(34, 197, 94, 0.3)"
                      : report.recommendation === "SELL"
                        ? "rgba(239, 68, 68, 0.3)"
                        : "rgba(59, 130, 246, 0.3)",
                  areaBottomColor: "rgba(255, 255, 255, 0)",
                }}
              />
            </div>
          </section>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RecommendationBadge({ type }: { type: string }) {
  let colorClass = "bg-gray-500 hover:bg-gray-600";
  let text = "HOLD";

  if (type === "BUY") {
    colorClass = "bg-green-500 hover:bg-green-600 shadow-green-200 shadow-md";
    text = "STRONG BUY";
  } else if (type === "SELL") {
    colorClass = "bg-red-500 hover:bg-red-600 shadow-red-200 shadow-md";
    text = "SELL";
  }

  return (
    <div
      className={`px-4 py-1.5 rounded-full text-white font-bold text-sm tracking-wide ${colorClass} transition-all`}
    >
      {text}
    </div>
  );
}

function UnknownView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>알 수 없는 상태입니다.</CardTitle>
      </CardHeader>
    </Card>
  );
}

export { AnalysisView };
