# TradingView Lightweight Charts 가이드

## 개요

TradingView Lightweight Charts는 금융 차트에 특화된 경량 라이브러리다.

## 설치

```bash
npm install lightweight-charts
# 또는
pnpm add lightweight-charts
```

## 기본 사용법

### 1. 차트 생성

```typescript
import { createChart, ColorType } from "lightweight-charts";

const chartOptions = {
  layout: {
    textColor: "black",
    background: { type: ColorType.Solid, color: "white" },
  },
  width: 800,
  height: 400,
};

const chart = createChart(document.getElementById("chart"), chartOptions);
```

### 2. 캔들스틱 시리즈 추가

```typescript
const candlestickSeries = chart.addCandlestickSeries({
  upColor: "#26a69a",
  downColor: "#ef5350",
  borderVisible: false,
  wickUpColor: "#26a69a",
  wickDownColor: "#ef5350",
});

// OHLCV 데이터 설정
candlestickSeries.setData([
  { time: "2024-01-01", open: 100, high: 105, low: 98, close: 102 },
  { time: "2024-01-02", open: 102, high: 108, low: 100, close: 106 },
  // ...
]);
```

### 3. 마커 추가 (신호 표시)

```typescript
candlestickSeries.setMarkers([
  {
    time: "2024-01-15",
    position: "belowBar",
    color: "#2196F3",
    shape: "arrowUp",
    text: "BUY",
  },
  {
    time: "2024-01-20",
    position: "aboveBar",
    color: "#e91e63",
    shape: "arrowDown",
    text: "SELL",
  },
]);
```

### 4. 라인 시리즈 (이동평균 등)

```typescript
const lineSeries = chart.addLineSeries({
  color: "#2962FF",
  lineWidth: 2,
});

lineSeries.setData([
  { time: "2024-01-01", value: 100 },
  { time: "2024-01-02", value: 101.5 },
  // ...
]);
```

## Zoom/Pan 기능

```typescript
// 전체 데이터에 맞게 조정
chart.timeScale().fitContent();

// 특정 범위로 설정
chart.timeScale().setVisibleRange({
  from: "2024-01-01",
  to: "2024-03-01",
});
```

## React 컴포넌트 예시

```tsx
import { useEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts";

interface ChartProps {
  data: CandlestickData[];
  markers?: SeriesMarker[];
}

export function StockChart({ data, markers }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addCandlestickSeries();
    series.setData(data);

    if (markers) {
      series.setMarkers(markers);
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => chart.remove();
  }, [data, markers]);

  return <div ref={containerRef} />;
}
```

## 다크 모드 지원

```typescript
const darkTheme = {
  layout: {
    background: { type: ColorType.Solid, color: "#1a1a2e" },
    textColor: "#d1d4dc",
  },
  grid: {
    vertLines: { color: "#2B2B43" },
    horzLines: { color: "#2B2B43" },
  },
};

chart.applyOptions(darkTheme);
```

## 참고 자료

- [공식 문서](https://tradingview.github.io/lightweight-charts/)
- [API 레퍼런스](https://tradingview.github.io/lightweight-charts/docs/api)
