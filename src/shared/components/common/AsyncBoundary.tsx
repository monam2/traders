"use client";

import { Suspense, type ComponentType, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

type AsyncBoundaryProps = {
  children: ReactNode;
  pendingFallback: ReactNode;
  rejectedFallback: ReactNode | ComponentType<FallbackProps>;
};

function AsyncBoundary({
  children,
  pendingFallback,
  rejectedFallback,
}: AsyncBoundaryProps) {
  const errorBoundaryProps =
    typeof rejectedFallback === "function"
      ? { FallbackComponent: rejectedFallback }
      : { fallback: rejectedFallback };

  return (
    <ErrorBoundary {...errorBoundaryProps}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export { AsyncBoundary };
