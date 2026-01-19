import { createClient } from "@/shared/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AnalysisStatus } from "@/domains/analysis/entities/analysis";

const analyzeSchema = z.object({
  ticker: z.string().min(1, "티커를 입력해주세요"),
  market: z.string().default("US"),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          code: 40100,
          message: "인증이 필요합니다",
          data: null,
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const result = analyzeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          code: 40201, // 분석 요청 검증 실패
          message: result.error.issues[0].message,
          data: null,
        },
        { status: 400 },
      );
    }

    const { ticker, market } = result.data;

    // TODO: Rate Limiting Check Here

    const { data: analysis, error: dbError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        ticker,
        market,
        options: [],
        status: AnalysisStatus.Processing,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json(
        {
          code: 50200, // 내부 서버 오류
          message: "데이터베이스 오류가 발생했습니다",
          data: null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        code: 20000,
        message: "Success",
        data: {
          id: analysis.id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        code: 50200,
        message: "알 수 없는 오류가 발생했습니다",
        data: null,
      },
      { status: 500 },
    );
  }
}
