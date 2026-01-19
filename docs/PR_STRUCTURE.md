# Recommended PR Structure

프로젝트의 체계적인 관리를 위해 다음 순서로 Pull Request(PR)를 작성하는 것을 권장한다.

## 1. Agent & Environment (feat/agent-config)

가장 먼저 프로젝트의 헌법과 에이전트 설정을 정의한다.

- **주요 파일**:
  - `GEMINI.md` (헌법)
  - `.agent/` (스킬 및 페르소나 설정)
  - `.gitignore` (보완됨)
- **목적**: 개발 방향성 및 규칙 확립.

## 2. Docs & Specs (feat/docs)

개발할 기능의 명세와 기술 문서를 등록한다.

- **주요 파일**:
  - `docs/` (API 가이드, 매뉴얼 등)
  - `specs/` (기능 명세, 에러 코드 등)
  - `README.md`
- **목적**: 구현 전 요구사항 명확화.

## 3. Backend Core (feat/backend-core)

데이터베이스, API, 코어 유틸리티를 구현한다.

- **주요 파일**:
  - `src/app/api/` (API 라우트)
  - `src/shared/lib/supabase/` (DB 클라이언트)
  - `src/shared/lib/api/` (API 유틸)
  - `package.json` (백엔드 디펜던시)
- **목적**: 데이터 흐름 및 비즈니스 로직 기반 마련.

## 4. Frontend Implementation (feat/frontend-feature)

사용자 인터페이스와 디자인 시스템을 적용한다.

- **주요 파일**:
  - `src/app/` (페이지 및 레이아웃)
  - `src/domains/` (도메인별 컴포넌트)
  - `src/shared/components/` (공통 UI)
  - `src/app/globals.css`, `tailwind.config.ts` (디자인 시스템)
- **목적**: 사용자 경험(UX) 구현.

## 5. QA & SEO (feat/qa-seo)

품질 보증을 위한 테스트와 검색 최적화를 마무리한다.

- **주요 파일**:
  - `tests/` (Playwright E2E)
  - `playwright.config.ts`
  - `src/app/layout.tsx` (메타데이터 보강)
- **목적**: 서비스 안정성 및 배포 준비.
