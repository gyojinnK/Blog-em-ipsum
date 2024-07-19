import type { Treatment } from "@shared/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get("/treatments");
  return data;
}

export function useTreatments(): Treatment[] {
  // fallback을 설정하는 이유
  // - fetching은 비동기 동작
  // - 데이터를 받아오기 전에 아래 data에 접근하게되면 예상하지 못한 오류 발생
  // - 이를 사전에 예방하기 위함
  const fallback: Treatment[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
  return data;
}

export const usePrefetchTreatments = (): void  => {
  // useQueryClient는 provider로 제공받는 queryClient를 반환
  // prefetchQuery는 queryClient 메소드이기 때문에 사용함
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    // queryKey는 fetchQuery의 키와 동일
    // 쿼리가 어떤 캐시를 찾아야하는지 알려주기 위함!
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
}