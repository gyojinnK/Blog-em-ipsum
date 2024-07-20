import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { generateAppointmentKey } from "@/react-query/key-factories";

// for when we need a query function for useQuery
async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { userId, userToken } = useLoginData();

  const fallbackAppointments: Appointment[] = [];

  const { data: userAppointments = fallbackAppointments } = useQuery({
    enabled: !!userId,
    // queryKey를 설정할 때는 쿼리 함수를 참고하는 것이 좋다.
    // 쿼리 함수에서 인자로 userId, userToken을 사용하기 때문에 쿼리 키도 이들로 구성하는 것이 좋다.
    queryKey: generateAppointmentKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
  });

  return userAppointments;
}
