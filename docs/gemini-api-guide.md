# Gemini API 통합 가이드

## 개요

Google Gemini API를 사용하여 이미지 분석 및 주식 차트 해석을 수행한다.

## 설치

```bash
npm install @google/generative-ai
```

## 기본 설정

### 환경 변수

```env
GEMINI_API_KEY=your_api_key_here
```

### API 인스턴스 생성

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
```

## 이미지 분석

### 이미지 파일 → Base64 변환

```typescript
async function fileToGenerativePart(file: File) {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return {
    inlineData: {
      data: base64,
      mimeType: file.type,
    },
  };
}
```

### 분석 요청

```typescript
const imagePart = await fileToGenerativePart(chartImage);

const result = await model.generateContent([
  "이 주식 차트를 분석해주세요. 패턴, 지지/저항선, 매매 신호를 JSON으로 반환하세요.",
  imagePart,
]);

const response = await result.response;
const text = response.text();
```

## SSE 스트리밍 (직접 구현)

### API Route

```typescript
// app/api/analyze/route.ts
export async function POST(req: Request) {
  const { prompt, image } = await req.json();

  const stream = await model.generateContentStream([prompt, image]);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.text();
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
        );
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

### 클라이언트

```typescript
async function streamAnalysis(data: AnalysisRequest) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const text = decoder.decode(value);
    // 파싱 및 UI 업데이트
  }
}
```

## 시스템 프롬프트

```typescript
const systemPrompt = `
당신은 전설적인 월스트리트 트레이더입니다.
제공된 차트 이미지를 분석하여 다음을 JSON으로 반환한다:

{
  "analysis_text": "마크다운 형식의 분석 리포트",
  "chart_points": [
    { "date": "YYYY-MM-DD", "price": 120, "label": "저항선" }
  ],
  "recommendation": "BUY" | "SELL" | "HOLD"
}
`;
```

## 에러 핸들링

```typescript
try {
  const result = await model.generateContent(prompt);
} catch (error) {
  if (error.message.includes("SAFETY")) {
    // 안전 필터에 의해 차단됨
    return { code: 40203, message: "분석할 수 없는 콘텐츠입니다" };
  }
  if (error.message.includes("RATE_LIMIT")) {
    // API 할당량 초과
    return { code: 50202, message: "API 요청 한도 초과" };
  }
  throw error;
}
```

## 비용 (2024 기준)

| 모델             | 입력            | 출력             |
| ---------------- | --------------- | ---------------- |
| Gemini 1.5 Pro   | $3.50/1M tokens | $10.50/1M tokens |
| Gemini 1.5 Flash | $0.35/1M tokens | $1.05/1M tokens  |

## 권장

- 개발/테스트: Gemini 1.5 Flash (저렴)
- 프로덕션: Gemini 1.5 Pro (정확도)
