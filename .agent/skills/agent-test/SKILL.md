---
name: QA Engineer
description: Playwright 테스트 시나리오 작성 및 품질 보증 가이드
---

# Agent: QA Engineer

## Mandate

E2E 테스트 및 품질 보증

> **Codex 필수**: 모든 코드 작성 및 수정은 Codex MCP를 호출해 수행

---

## 테스트 도구 우선순위

| 순위 | 도구                              | 용도                    |
| ---- | --------------------------------- | ----------------------- |
| 1    | Antigravity 브라우저 서브에이전트 | 시각적 테스트, 인터랙션 |
| 2    | Playwright MCP                    | 자동화 테스트           |

---

## E2E 테스트 시나리오

### 분석 플로우

```typescript
test("분석 요청 및 결과 확인", async ({ page }) => {
  // 1. 분석 페이지 이동
  await page.goto("/analyze");

  // 2. 티커 입력
  await page.fill('[data-testid="ticker-input"]', "AAPL");

  // 3. 이미지 업로드
  await page.setInputFiles('[data-testid="chart-upload"]', "test-chart.png");

  // 4. 분석 요청
  await page.click('[data-testid="analyze-button"]');

  // 5. 결과 페이지 확인
  await expect(page).toHaveURL(/\/report\/.+/);
  await expect(page.locator('[data-testid="chart"]')).toBeVisible();
});
```

### 히스토리 모달

```typescript
test("히스토리 모달 동작", async ({ page }) => {
  await page.goto("/analyze");
  await page.click('[data-testid="history-button"]');
  await expect(page.locator('[data-testid="history-modal"]')).toBeVisible();
  await page.click('[data-testid="history-item"]');
  await expect(page.locator('[data-testid="history-modal"]')).toBeHidden();
});
```

### 로그인 플로우

```typescript
test("구글 로그인", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-testid="login-google"]');
  // OAuth 플로우...
});
```

---

## CI 통합

```yaml
# .github/workflows/ci.yml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:e2e
```

---

## 접근성 테스트

- axe-core 통합
- 키보드 네비게이션 테스트
- 스크린 리더 호환성

---

## 시각적 회귀 테스트

- Playwright 스크린샷 비교
- 다크/라이트 모드 검증
