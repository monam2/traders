import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { createAnalysis, getAnalysis } from "@/domains/analysis/api/api";

const getAnalysisKey = (id: string) => ["analysis", id];

export const useAnalysis = Object.assign(
  (id: string) => {
    return useSuspenseQuery({
      queryKey: getAnalysisKey(id),
      queryFn: () => getAnalysis(id),
    });
  },
  {
    getQueryKey: getAnalysisKey,
  },
);

export const useCreateAnalysis = () =>
  useMutation({
    mutationFn: (ticker: string) => createAnalysis(ticker),
  });
