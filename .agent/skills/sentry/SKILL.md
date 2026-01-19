---
name: Sentry
description: 에러 모니터링 및 추적 스킬
---

# Sentry 에러 모니터링 스킬

## 설치

```bash
npx @sentry/wizard@latest -i nextjs
```

## 환경 변수

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx
```

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

### sentry.server.config.ts

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## 에러 캡처

### 자동 캡처

- 프론트엔드 에러 자동 수집
- API Route 에러 자동 수집

### 수동 캡처

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { module: "analysis" },
    extra: { ticker: "AAPL" },
  });
}
```

## 사용자 컨텍스트

```typescript
// 로그인 시
Sentry.setUser({
  id: user.id,
  email: user.email,
});

// 로그아웃 시
Sentry.setUser(null);
```

## 커스텀 에러 코드 연동

```typescript
if (response.code !== 20000) {
  Sentry.captureMessage(`API Error: ${response.code}`, {
    level: "error",
    tags: { errorCode: response.code },
  });
}
```

## 체크리스트

- [ ] Sentry 프로젝트 생성
- [ ] wizard 실행
- [ ] 환경 변수 설정
- [ ] 사용자 컨텍스트 연동
- [ ] 커스텀 에러 코드 태깅
