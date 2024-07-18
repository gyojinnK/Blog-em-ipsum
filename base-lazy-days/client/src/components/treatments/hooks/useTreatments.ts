import type { Treatment } from "@shared/types";
import { useQuery } from "@tanstack/react-query";

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
