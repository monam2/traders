"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">오류가 발생했습니다</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            {error.message ||
              "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="default" onClick={() => reset()}>
            다시 시도
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
