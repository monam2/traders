# Feature: AI Stock Analyst

## 개요

사용자가 주식 종목을 검색하고 차트 이미지를 업로드하면, AI가 분석하여 인터랙티브 리포트를 제공한다.

---

## 사용자 스토리

### US-01: 분석 요청

**As a** 사용자
**I want to** 종목과 차트 이미지를 업로드
**So that** AI 분석 결과를 받을 수 있다

**Acceptance Criteria:**

- [ ] 종목 검색 (티커/이름/영문명)
- [ ] 이미지 업로드 (png, jpg, webp, 최대 5MB)
- [ ] 미리보기 표시
- [ ] 분석 요청 버튼

---

### US-02: 실시간 진행률

**As a** 사용자
**I want to** 분석 진행률을 실시간으로 확인
**So that** 대기 시간을 알 수 있다

**Acceptance Criteria:**

- [ ] SSE로 진행률 스트리밍
- [ ] 프로그레스 바 표시
- [ ] 단계별 메시지 (분석 중... 30%)

---

### US-03: 인터랙티브 결과

**As a** 사용자
**I want to** 분석 결과를 차트로 확인
**So that** 시각적으로 이해할 수 있다

**Acceptance Criteria:**

- [ ] TradingView 차트 렌더링
- [ ] 마커 표시 (지지/저항선, 신호)
- [ ] Zoom/Pan 기능
- [ ] 마크다운 리포트

---

### US-04: 히스토리

**As a** 사용자
**I want to** 이전 분석 내역을 확인
**So that** 과거 분석을 다시 볼 수 있다

**Acceptance Criteria:**

- [ ] 히스토리 목록 모달
- [ ] 클릭 시 결과 로드
- [ ] 날짜/종목으로 정렬

---

### US-05: 로그인

**As a** 사용자
**I want to** 소셜 로그인
**So that** 내 분석을 저장할 수 있다

**Acceptance Criteria:**

- [ ] 카카오 로그인
- [ ] 구글 로그인
- [ ] 로그아웃

---

### US-06: API 키 설정

**As a** 사용자
**I want to** 내 Gemini API 키를 등록
**So that** 무제한으로 분석할 수 있다

**Acceptance Criteria:**

- [ ] 설정 모달
- [ ] 키 입력/테스트/저장
- [ ] 암호화 저장

---

## 기술 스펙

### 페이지

| 경로           | 설명      |
| -------------- | --------- |
| `/`            | 랜딩      |
| `/analyze`     | 분석 요청 |
| `/report/[id]` | 결과      |

### API

| 메서드 | 경로               | 설명       |
| ------ | ------------------ | ---------- |
| POST   | `/api/analyze`     | 분석 요청  |
| GET    | `/api/report/[id]` | 결과 (SSE) |
| GET    | `/api/history`     | 히스토리   |

### 데이터 스키마

```typescript
interface Analysis {
  id: string;
  userId: string;
  ticker: string;
  status: "processing" | "completed" | "failed";
}

interface Report {
  id: string;
  analysisId: string;
  summary: string;
  chartData: OHLCV[];
  signals: Signal[];
  recommendation: "BUY" | "SELL" | "HOLD";
}
```
