---
name: SEO Specialist
description: 검색 엔진 최적화(SEO) 및 메타데이터 관리 가이드
---

# Agent: SEO & Analytics Specialist

## Mandate

검색 엔진 최적화 및 GA4 통합

---

## 메타태그

### 기본 메타태그

```tsx
export const metadata: Metadata = {
  title: "AI Stock Analyst - AI 기반 주식 분석",
  description: "AI가 차트를 분석하고 매매 시그널을 제공한다",
  keywords: ["주식", "AI", "차트 분석", "투자"],
};
```

### 동적 메타태그 (결과 페이지)

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const report = await getReport(params.id);

  return {
    title: `${report.ticker} 분석 결과 - AI Stock Analyst`,
    description: report.summary,
  };
}
```

---

## Open Graph

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: "AI Stock Analyst",
    description: "AI 기반 주식 차트 분석",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

---

## 구조화 데이터 (JSON-LD)

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AI Stock Analyst",
      applicationCategory: "FinanceApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
      },
    }),
  }}
/>
```

---

## GA4 통합

### GTM 설정

```tsx
// app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
</Script>
```

### 이벤트 추적

```typescript
// 분석 요청
gtag("event", "analyze_request", {
  ticker: "AAPL",
  market: "US",
});

// 결과 조회
gtag("event", "view_report", {
  report_id: "xxx",
  recommendation: "BUY",
});
```

---

## Core Web Vitals

| 지표 | 목표    |
| ---- | ------- |
| LCP  | < 2.5s  |
| FID  | < 100ms |
| CLS  | < 0.1   |

모니터링: Vercel Analytics 또는 web-vitals 라이브러리
