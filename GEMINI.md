# Project Constitution: AI Stock Analyst

## 1. Core Principles

### 상태 관리 전략

| 저장소            | 용도                | 예시                    |
| ----------------- | ------------------- | ----------------------- |
| URL Query Params  | 공유 가능한 뷰 상태 | ticker, period, filters |
| Web Storage       | 사용자 설정         | 테마, API 키            |
| React Local State | 일시적 UI 상태      | 모달 열림, 폼 입력      |

### Persistence First

분석 결과는 생성 즉시 DB에 저장. ID로 언제든 접근 가능.

### Type Safety

모든 입력(Form, API)은 Zod로 검증.

---

## 2. 에이전트 행동 원칙

1. **구체화 원칙**: 사용자 입력을 더 구체화할 것
2. **검증 원칙**: 후보(옵션)가 2개 이상이면 반드시 사용자에게 질문
3. **피드백 루프**: 결정 사항 필요 시 진행 전 확인 요청
4. **Codex 필수**: 코드 수정 및 개발 관련 작업은 **반드시** Codex MCP를 호출해 수행

---

## 3. Agent Role & Skill Matrix

메인 에이전트(GEMINI)는 작업의 성격에 따라 적절한 서브 에이전트(Persona)와 스킬(Skill)을 조합하여 수행한다.

### 🏢 Persona (Sub-Agents)

> 작업의 주체(Identity). 해당 도메인의 책임자로서 판단하고 행동한다.

| 페르소나               | 디렉토리          | 담당 영역                     | 필수 스킬                      |
| :--------------------- | :---------------- | :---------------------------- | :----------------------------- |
| **Frontend Engineer**  | `agent-frontend`  | 아키텍처, 컴포넌트, 상태 관리 | Accessibility, Storybook, i18n |
| **Backend Engineer**   | `agent-backend`   | API, SSE, 보안, 세션          | Sentry, Database               |
| **Database Engineer**  | `agent-database`  | 스키마, 마이그레이션, RLS     | Lint & TypeCheck               |
| **Designer**           | `agent-design`    | 테마, UI/UX, 애니메이션       | Storybook, Accessibility       |
| **QA Engineer**        | `agent-test`      | E2E 테스트, 품질 검증         | Sentry, Lint & TypeCheck       |
| **Analytics Engineer** | `agent-analytics` | AI 프롬프트, 데이터 분석      | TradingView Charts             |
| **SEO Specialist**     | `agent-seo`       | SEO, 메타데이터, GA4          | i18n, Accessibility            |

### 🛠️ Skills (Capabilities)

> 작업에 필요한 도구(Tools). 페르소나가 장착하여 사용한다.

| 스킬                 | 디렉토리         | 용도                       |
| :------------------- | :--------------- | :------------------------- |
| **TradingView**      | `tradingview`    | 차트 구현 및 지표 시각화   |
| **Accessibility**    | `accessibility`  | WCAG 2.1 AA 접근성 준수    |
| **i18n**             | `i18n`           | 다국어(KO/EN) 처리         |
| **Sentry**           | `sentry`         | 에러 로깅 및 모니터링      |
| **Storybook**        | `storybook`      | UI 문서화 및 시각적 테스트 |
| **Lint & TypeCheck** | `lint-typecheck` | 정적 분석 및 품질 관리     |

### 🔌 MCP Servers (Integrated Tools)

> 에이전트가 호출 가능한 외부 연동 서버.

| 서버명                  | 기능                                        |
| :---------------------- | :------------------------------------------ |
| **Codex**               | 코드 편집, 리뷰, 커맨드 실행 (필수 사용)    |
| **Chrome DevTools**     | 브라우저 디버깅, 콘솔 로그 및 네트워크 확인 |
| **Playwright**          | 브라우저 자동화 및 E2E 테스트 수행          |
| **Context7**            | 최신 라이브러리 문서 및 예제 검색           |
| **Sequential Thinking** | 복잡한 문제 해결을 위한 사고 과정 전개      |

---

## 3. Tech Stack

| 분류      | 기술                           |
| --------- | ------------------------------ |
| Framework | Next.js 15 (App Router)        |
| Language  | TypeScript                     |
| Styling   | Tailwind CSS + Shadcn UI       |
| Data      | React Query + ky               |
| DB        | Supabase (PostgreSQL)          |
| Auth      | Supabase Auth (카카오, 구글)   |
| Chart     | TradingView Lightweight Charts |
| AI        | @google/generative-ai          |
| Realtime  | SSE (직접 구현)                |
| Test      | Playwright                     |
| CI/CD     | GitHub Actions                 |

---

## 4. 디자인 규칙

### 금지

- 그라데이션
- 이모지

### 필수

- border-radius (8-16px)
- shadow (부드러운 입체감)
- 스켈레톤 UI (로딩 상태)

### 테마

- 기본: 시스템 설정 따름
- 토글: 헤더에서 다크/라이트 전환

### 아이콘

- Lucide React (플랫 스타일)

---

## 5. API 키 전략

### 하이브리드

- 서버 키: 일일 3회 제한
- 사용자 키 (BYOK): 무제한

### 남용 방지

- IP당 5회/일 제한
- 디바이스 핑거프린팅

### 저장

- AES-256 암호화 후 DB 저장

---

## 6. 커스텀 에러 코드

### 형식: 5자리 XYYYZ

- X: HTTP 상태 앞자리 (2,4,5)
- YY: 도메인 (00공통, 01인증, 02분석, 03리포트)
- Z: 세부 코드

### 예시

| 코드  | 의미            |
| ----- | --------------- |
| 20000 | 성공            |
| 40101 | 토큰 만료       |
| 50201 | Gemini API 오류 |

---

## 7. 워크플로우

```
[분석 요청] → [즉시 ID 발급] → [DB에 processing 저장]
     ↓
[SSE 연결] → [Gemini 호출] → [진행률 전송]
     ↓
[완료] → [DB 업데이트] → [클라이언트 렌더링]
```

---

## 8. 대화 동기화

### 규칙

- 모든 대화 내용은 `docs/conversation.md`에 동기화
- 형식: `[타임스탬프] **화자** (컨셉)`
- 개발자(cwkang) 요청은 원본 유지
- Antigravity 답변은 요약

### 동기화 시점

- 사용자 요청 직후
- 결정 사항 확정 시
- 파일 생성/수정 완료 시
