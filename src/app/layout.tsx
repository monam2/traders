import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/shared/components/layout/Header";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // TODO: Production URL로 변경 필요
  title: {
    template: "%s | AI Stock Analyst",
    default: "AI Stock Analyst - AI 기반 주식 분석 리포트",
  },
  description:
    "AI가 차트를 분석하고 매매 시그널을 제공합니다. 기술적 지표, 추세 분석, 매매 추천을 실시간으로 확인하세요.",
  keywords: ["주식", "AI", "차트 분석", "투자", "자동매매", "기술적 분석"],
  openGraph: {
    title: "AI Stock Analyst",
    description: "AI 기반 주식 차트 분석 및 매매 시그널 제공",
    url: "/",
    siteName: "AI Stock Analyst",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Stock Analyst",
    description: "AI 기반 주식 차트 분석",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AI Stock Analyst",
              applicationCategory: "FinanceApplication",
              description: "AI 기반 주식 차트 분석 및 매매 시그널 제공",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
