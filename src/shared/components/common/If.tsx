import { ReactNode } from "react";

type IfProps = {
  condition: boolean | undefined | null;
  ifTrue?: ReactNode;
  ifFalse?: ReactNode;
  children?: ReactNode;
};

export function If({ condition, ifTrue, ifFalse = null, children }: IfProps) {
  if (condition) {
    return <>{ifTrue ?? children}</>;
  }

  return <>{ifFalse}</>;
}
