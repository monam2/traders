"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";

import { useCreateAnalysis } from "@/domains/analysis/hooks/useAnalysis";
import { If } from "@/shared/components/common/If";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { createClient } from "@/shared/lib/supabase/client";

const formSchema = z.object({
  ticker: z.string().trim().min(1, "티커를 입력해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

const SearchForm = () => {
  const router = useRouter();
  const createAnalysis = useCreateAnalysis();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (createAnalysis.isPending) {
      return;
    }

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      // userError가 "user not found" 같은 경우일 때 예외 던지기보다 null check가 안전할 수 있음
      // Supabase getUser는 에러 시 null user 반환 가능성 있음.

      if (!userData.user) {
        const { error: signInError } = await supabase.auth.signInAnonymously();

        if (signInError) {
          throw signInError;
        }
      }

      const analysisId = await createAnalysis.mutateAsync(data.ticker);
      router.push(
        `/analyze?ticker=${encodeURIComponent(data.ticker)}&id=${analysisId}`,
      );
    } catch (error) {
      console.error(error);
      form.setError("ticker", {
        message: "분석 요청에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:items-start"
      >
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="티커 입력 (예: AAPL, 005930)"
                    autoComplete="off"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="shrink-0"
          disabled={createAnalysis.isPending}
        >
          <If
            condition={createAnalysis.isPending}
            ifTrue={
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 중
              </>
            }
            ifFalse="분석"
          />
        </Button>
      </form>
    </Form>
  );
};

export default SearchForm;
