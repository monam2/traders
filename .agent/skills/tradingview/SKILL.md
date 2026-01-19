---
name: TradingView Charts
description: TradingView Lightweight Charts 구현 스킬
---

# TradingView Lightweight Charts 스킬

## 참조 문서

상세 가이드: [docs/tradingview-manual.md](file:///Users/cwkang/Dev/traders/docs/tradingview-manual.md)

## 핵심 사용법

### 설치

```bash
pnpm add lightweight-charts
```

### 기본 차트 생성

```typescript
import { createChart } from "lightweight-charts";

const chart = createChart(container, { width: 800, height: 400 });
const series = chart.addCandlestickSeries();
series.setData(ohlcData);
```

### 마커 추가

```typescript
series.setMarkers([
  {
    time: "2024-01-15",
    position: "belowBar",
    color: "#2196F3",
    shape: "arrowUp",
    text: "BUY",
  },
]);
```

### Zoom/Pan

```typescript
chart.timeScale().fitContent();
```

## 다크 모드

```typescript
chart.applyOptions({
  layout: {
    background: { type: ColorType.Solid, color: "#1a1a2e" },
    textColor: "#d1d4dc",
  },
});
```

## 체크리스트

- [ ] 캔들스틱 시리즈 렌더링
- [ ] OHLCV 데이터 바인딩
- [ ] 마커/주석 표시
- [ ] 다크 모드 지원
- [ ] 반응형 리사이징
