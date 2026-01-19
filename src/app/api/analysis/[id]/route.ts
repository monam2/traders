import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

import { createClient, createAdminClient } from "@/shared/lib/supabase/server";
import { AnalysisResult } from "@/shared/lib/ai/zai";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isStreamClosed = false;

      const safeEnqueue = (data: string) => {
        if (isStreamClosed || request.signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(data));
        } catch (e) {
          console.warn("Stream enqueue failed:", e);
          isStreamClosed = true;
        }
      };

      const safeClose = () => {
        if (isStreamClosed) return;
        try {
          controller.close();
        } catch (e) {
          console.warn("Stream close failed:", e);
        } finally {
          isStreamClosed = true;
        }
      };

      const sendEvent = (data: unknown) => {
        safeEnqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      try {
        const supabase = await createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        console.log("Analysis Route User:", user?.id, "Auth Error:", authError);

        // 1. Validate Analysis ID and Status
        const { data: analysis, error: fetchError } = await supabase
          .from("analyses")
          .select("id, ticker, status")
          .eq("id", id)
          .single();

        if (fetchError || !analysis) {
          sendEvent({ error: "Analysis not found" });
          safeClose();
          return;
        }

        if (analysis.status === "completed") {
          sendEvent({
            status: "completed",
            message: "Analysis already completed",
          });
          safeClose();
          return;
        }

        // 2. Initialize Gemini (SKIPPED FOR MOCK MODE)
        /*
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
           // ... error handling ...
        }
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        ...
        */

        // 3. Generate Content
        sendEvent({
          status: "processing",
          progress: 10,
          message: "Initializing AI (Mock Mode)...",
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        sendEvent({
          status: "processing",
          progress: 40,
          message: "Analyzing market data...",
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        sendEvent({
          status: "processing",
          progress: 80,
          message: "Generating report...",
        });

        const basePrice = 100 + Math.random() * 50;
        const reportData: AnalysisResult = {
          summary: `${analysis.ticker}에 대한 AI 분석 결과입니다. 현재 기술적 지표와 시장 데이터를 종합할 때, 해당 종목은 강력한 성장 잠재력을 보여주고 있습니다. 특히 최근 거래량 증가와 함께 주요 저항선을 돌파하려는 시도가 긍정적입니다. 단기 변동성에 유의하며 분할 매수 관점에서 접근하는 것이 권장됩니다. (데모 데이터)`,
          recommendation: "BUY",
          signals: [
            "골든크로스 발생 직전",
            "기관/외국인 수급 개선",
            "RSI 지표 중립 구간 위치",
          ],
          chartData: Array.from({ length: 30 }, (_, i) => ({
            time: new Date(Date.now() - (29 - i) * 86400000)
              .toISOString()
              .split("T")[0],
            value: basePrice + (Math.random() * 10 - 2) + i,
          })),
        };

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 500));

        const adminSupabase = await createAdminClient();

        // 4. Save to DB
        const { error: insertError } = await adminSupabase
          .from("reports")
          .insert({
            analysis_id: id,
            summary: reportData.summary,
            recommendation: reportData.recommendation,
            signals: reportData.signals,
            chart_data: reportData.chartData,
          });

        if (insertError) throw insertError;

        const { error: updateError } = await adminSupabase
          .from("analyses")
          .update({ status: "completed" })
          .eq("id", id);

        if (updateError) throw updateError;

        sendEvent({ status: "completed", data: reportData });
        safeClose();
      } catch (err: unknown) {
        const error = err as Error;
        console.error("Global Analysis Error:", error);

        const adminSupabase = await createAdminClient();
        await adminSupabase
          .from("analyses")
          .update({ status: "failed" })
          .eq("id", id);

        if (!request.signal.aborted) {
          sendEvent({
            status: "failed",
            error: error.message || "Unknown error",
            code: 50200,
          });
        }
        safeClose();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
