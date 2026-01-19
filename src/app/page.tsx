import SearchForm from "@/domains/stock/components/SearchForm";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-bold">AI Stock Analyst</h1>
        <p className="text-muted-foreground">
          주식 티커를 입력하고 AI 분석을 받아보세요.
        </p>
        <SearchForm />
      </main>
    </div>
  );
}
