import { queryKeys } from "./constants";

export const generateUserKey = (userId: number, userToken: string) => {
  // 사용자 토큰을 의도적으로 배제
  // 토큰이 변경되더라도 사용자 ID에 대한 키를 동일하게 유지하기 위함
  return [queryKeys.user, userId];
};

export const generateAppointmentKey = (userId: number, userToken: string) => {
  return [queryKeys.appointments, queryKeys.user, userId, userToken];
};
