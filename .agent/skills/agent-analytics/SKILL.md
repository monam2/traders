---
name: Analytics Engineer
description: 데이터 분석 로직 및 Gemini AI 프롬프트 엔지니어링 가이드
---

# Agent: Analysis Engineert

## Mandate

Gemini API 프롬프트 엔지니어링 및 차트 분석 로직 구현

> **Codex 필수**: 모든 코드 작성 및 수정은 Codex MCP를 호출해 수행

---

## Gemini 모델

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
```

---

## 시스템 프롬프트

```
당신은 전설적인 월스트리트 트레이더이자 데이터 분석가입니다.
제공된 "종목 티커"와 "차트 이미지"를 기반으로 다음을 수행한다:

1. 멀티모달 분석: 차트 이미지에서 패턴을 시각적으로 분석
   (헤드앤숄더, 이동평균선, 지지/저항선 등)

2. 데이터 추출: 분석 결과를 JSON으로 구조화

3. 구조화된 출력: 반드시 다음 JSON 형식을 포함

{
  "analysis_text": "마크다운 형식의 상세 분석 리포트",
  "chart_points": [
    {
      "date": "YYYY-MM-DD",
      "price": 120,
      "label": "저항선",
      "type": "resistance"
    }
  ],
  "recommendation": "BUY" | "SELL" | "HOLD",
  "confidence": 0.85,
  "summary": "한 줄 요약"
}
```

---

## Output Schema

```typescript
interface AnalysisResult {
  analysis_text: string; // 마크다운 리포트
  chart_points: ChartPoint[]; // 차트 마커
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number; // 0-1
  summary: string; // 한 줄 요약
}

interface ChartPoint {
  date: string; // YYYY-MM-DD
  price: number;
  label: string;
  type: "support" | "resistance" | "signal" | "trend";
}
```

---

## 이미지 분석 플로우

```
[차트 이미지 업로드]
       ↓
[Base64 인코딩]
       ↓
[시스템 프롬프트 + 이미지]
       ↓
[Gemini API 호출]
       ↓
[SSE 스트리밍 응답]
       ↓
[JSON 파싱]
       ↓
[DB 저장 + 클라이언트 전송]
```

---

## 이미지 정책

**차트 이미지 필수**

- 이미지 없이는 분석 불가
- 프론트엔드에서 업로드 필수 검증
- 에러 코드: `40202` (이미지 누락)

```typescript
if (!image) {
  return { code: 40202, message: "차트 이미지를 업로드해주세요" };
}
```

---

## 에러 처리

| 상황           | 코드  | 처리             |
| -------------- | ----- | ---------------- |
| 안전 필터 차단 | 40203 | 분석 불가 메시지 |
| 할당량 초과    | 50202 | 재시도 요청      |
| 파싱 실패      | 50204 | 수동 분석 제안   |

---

## 참조

- Gemini API 가이드: `docs/gemini-api-guide.md`
