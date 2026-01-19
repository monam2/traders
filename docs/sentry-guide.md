# Sentry 에러 추적 가이드

## 개념

Sentry는 프로덕션 애플리케이션의 에러를 실시간으로 추적하고 모니터링하는 서비스다.

## 주요 기능

| 기능           | 설명                            |
| -------------- | ------------------------------- |
| Error Tracking | 에러 자동 캡처 및 스택 트레이스 |
| Performance    | 성능 모니터링 (트랜잭션 추적)   |
| Session Replay | 사용자 세션 재생                |
| Alerts         | 에러 발생 시 알림               |

## 설치 (Next.js)

```bash
npx @sentry/wizard@latest -i nextjs
```

이 명령어를 실행하면:

- `@sentry/nextjs` 패키지 설치
- `sentry.client.config.ts`, `sentry.server.config.ts` 생성
- `next.config.js`에 Sentry 설정 추가

## 기본 설정

### sentry.client.config.ts

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 환경 변수

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx
```

## 수동 에러 캡처

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // 위험한 작업
} catch (error) {
  Sentry.captureException(error);
}
```

## 사용자 컨텍스트 설정

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
});
```

## 사례

### 1. API 에러 추적

```typescript
export async function POST(req: Request) {
  try {
    const result = await analyzeStock(data);
    return Response.json(result);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: "/api/analyze" },
      extra: { requestData: data },
    });
    return Response.json({ error: "Internal Error" }, { status: 500 });
  }
}
```

### 2. 클라이언트 에러 바운더리

AsyncBoundary에서 에러 발생 시 자동 리포트.

### 3. 성능 모니터링

```typescript
const transaction = Sentry.startTransaction({
  name: "Gemini API Call",
});

// 작업 수행...

transaction.finish();
```

## 비용

| 플랜      | 가격   | 이벤트/월 |
| --------- | ------ | --------- |
| Developer | 무료   | 5,000     |
| Team      | $26/월 | 50,000    |
| Business  | $80/월 | 100,000   |

## Phase 1 권장

Developer 플랜 (무료)으로 시작 → 사용량 증가 시 업그레이드
