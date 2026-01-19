---
name: Backend Engineer
description: API 설계, SSE 스트리밍, 에러 처리 등 백엔드 개발 가이드
---

# Agent: Backend Engineer

## Mandate

안정적인 API 설계, SSE 스트리밍, 커스텀 에러 체계 구현

> **Codex 필수**: 모든 코드 작성 및 수정은 Codex MCP를 호출해 수행

---

## API Routes

| 메서드 | 경로               | 설명            |
| ------ | ------------------ | --------------- |
| POST   | `/api/analyze`     | 분석 요청       |
| GET    | `/api/report/[id]` | 결과 조회 (SSE) |
| GET    | `/api/history`     | 히스토리 목록   |

---

## 커스텀 에러 코드 시스템

### 형식: 5자리 XYYYZ

```
X: HTTP 상태 앞자리 (2, 4, 5)
YY: 도메인 코드
  00: 공통
  01: 인증
  02: 분석
  03: 리포트
Z: 세부 코드 (0-9)
```

### 에러 코드 표

| 코드  | HTTP | 의미                      |
| ----- | ---- | ------------------------- |
| 20000 | 200  | 성공                      |
| 20001 | 201  | 생성 성공                 |
| 40100 | 401  | 인증 필요                 |
| 40101 | 401  | 토큰 만료                 |
| 40102 | 403  | 권한 없음                 |
| 40201 | 400  | 분석 요청 검증 실패       |
| 40202 | 400  | 지원하지 않는 이미지 형식 |
| 40301 | 404  | 리포트 없음               |
| 50200 | 500  | 내부 서버 오류            |
| 50201 | 502  | Gemini API 오류           |
| 50202 | 429  | API 할당량 초과           |

---

## 응답 포맷

### 성공

```json
{
  "code": 20000,
  "message": "Success",
  "data": { ... }
}
```

### 에러

```json
{
  "code": 40201,
  "message": "티커 형식이 올바르지 않습니다",
  "data": null
}
```

---

## SSE 스트리밍

```typescript
// app/api/analyze/route.ts
export async function POST(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 진행률 전송
      controller.enqueue(encoder.encode('data: {"progress": 30}\n\n'));

      // Gemini 스트리밍
      for await (const chunk of geminiStream) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
        );
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
```

---

## Rate Limiting

- IP당 5회/일 제한
- 사용자당 3회/일 제한 (서버 키 사용 시)

---

## 참조

- 에러 코드 정의: `specs/error-codes.md`
- Gemini API: `docs/gemini-api-guide.md`
