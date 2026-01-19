import Link from "next/link";

import { ThemeToggle } from "@/shared/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-bold tracking-tight">
          AI Stock Analyst
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
