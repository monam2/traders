import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAnalysis } from "@/domains/analysis/hooks/useAnalysis";
import {
  Analysis,
  AnalysisStatus,
  Report,
} from "@/domains/analysis/entities/analysis";

export function useAnalysisRealtime(id: string) {
  const queryClient = useQueryClient();
  const { data: analysis } = useAnalysis(id);
  const queryKey = useMemo(() => useAnalysis.getQueryKey(id), [id]);

  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("초기화 중...");

  useEffect(() => {
    if (analysis.status !== AnalysisStatus.Processing) {
      return;
    }

    const eventSource = new EventSource(`/api/analysis/${id}`);

    eventSource.onopen = () => {
      console.log("SSE Connected, readyState:", eventSource.readyState);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // SSE 수신 성공
        if (data.status === AnalysisStatus.Completed) {
          setProgress(100);
          setMessage("분석 완료!");
          console.log("Analysis Completed, Updating Cache Directly");
          console.log(data);

          queryClient.setQueryData(
            queryKey,
            (oldAnalysis: Analysis | undefined) => {
              if (!oldAnalysis) return oldAnalysis;

              const newReport: Report = {
                id: "temp-realtime-id",
                analysisId: id,
                summary: data.data.summary,
                chartData: data.data.chartData,
                signals: data.data.signals,
                recommendation: data.data.recommendation,
                createdAt: new Date().toISOString(),
              };

              return {
                ...oldAnalysis,
                status: AnalysisStatus.Completed,
                report: newReport,
              };
            },
          );

          eventSource.close();
        } else if (data.status === AnalysisStatus.Failed) {
          console.log("Analysis Failed, Updating Cache Directly");
          setMessage("분석 실패");

          queryClient.setQueryData(
            queryKey,
            (oldAnalysis: Analysis | undefined) => {
              if (!oldAnalysis) return oldAnalysis;
              return {
                ...oldAnalysis,
                status: AnalysisStatus.Failed,
              };
            },
          );

          eventSource.close();
        } else {
          // Progress Update
          if (data.progress) setProgress(data.progress);
          if (data.message) setMessage(data.message);
        }
      } catch (error) {
        console.error("SSE Parse Error", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error", error, "readyState:", eventSource.readyState);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id, analysis.status, queryClient, queryKey]);

  return { progress, message };
}
