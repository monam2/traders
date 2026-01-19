import { redirect } from "next/navigation";
import { isEmpty } from "es-toolkit/compat";
import type { Metadata } from "next";

import { AnalysisView } from "@/domains/analysis/components/AnalysisView";
import { InitializingView } from "@/domains/analysis/components/InitializingView";

import { If } from "@/shared/components/common/If";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AsyncBoundary } from "@/shared/components/common/AsyncBoundary";
import { createClient } from "@/shared/lib/supabase/server";

type AnalyzePageProps = {
  searchParams: Promise<{ ticker?: string; id?: string }>;
};

export async function generateMetadata({
  searchParams,
}: AnalyzePageProps): Promise<Metadata> {
  const { ticker, id } = await searchParams;

  if (!ticker) {
    return {
      title: "AI Stock Analyst",
      description: "AI 기반 주식 분석 리포트",
    };
  }

  // ID가 없거나 처리 중일 때의 기본 메타데이터
  let title = `${ticker} 분석 진행 중 | AI Stock Analyst`;
  let description = `${ticker} 종목에 대한 AI 심층 분석을 진행하고 있습니다. 잠시만 기다려주세요.`;

  if (id) {
    const supabase = await createClient();
    const { data: analysis } = await supabase
      .from("analyses")
      .select(
        `
        status,
        reports (
          recommendation,
          summary
        )
      `,
      )
      .eq("id", id)
      .single();

    if (analysis?.status === "completed" && analysis.reports?.[0]) {
      const report = analysis.reports[0];
      const sentiment =
        report.recommendation === "BUY"
          ? "매수 추천"
          : report.recommendation === "SELL"
            ? "매도 추천"
            : "관망";

      title = `${ticker} 분석 결과 (${sentiment}) | AI Stock Analyst`;
      description = report.summary.slice(0, 160) + "...";
    } else if (analysis?.status === "failed") {
      title = `${ticker} 분석 실패 | AI Stock Analyst`;
      description = "분석 중 오류가 발생했습니다.";
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ko_KR",
      siteName: "AI Stock Analyst",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const { ticker, id } = await searchParams;

  if (!ticker) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <AsyncBoundary
        pendingFallback={<Skeleton className="h-[400px] w-full" />}
        rejectedFallback={
          <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-destructive/40 bg-destructive/5 text-destructive">
            분석 결과를 불러오는 중 문제가 발생했습니다.
          </div>
        }
      >
        <If
          condition={!isEmpty(id)}
          ifTrue={<AnalysisView />}
          ifFalse={<InitializingView />}
        />
      </AsyncBoundary>
    </main>
  );
}
