import ky from "ky";
import { env } from "@/shared/lib/env";

export const apiClient = ky.create({
  prefixUrl: typeof window === "undefined" ? env.NEXT_PUBLIC_API_URL : "/api",
  timeout: 30000,
  retry: {
    limit: 1, // 재시도 1회
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      () => {
        // 인증 토큰 헤더 추가 등의 로직이 필요하면 여기에 추가
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          // 400 ~ 500 에러 처리
          // 커스텀 에러 포맷 (XYYYZ) 파싱 로직
          try {
            const errorData = (await response.json()) as {
              code?: number;
              message?: string;
            };
            if (errorData && errorData.code) {
              // 여기서 전역 에러 처리 로직을 연결하거나, 단순히 에러를 throw하여 RQ에서 처리
              // console.error("Global API Error:", errorData);
            }
          } catch {
            // JSON 파싱 실패 시 무시
          }
        }
      },
    ],
  },
});

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};
