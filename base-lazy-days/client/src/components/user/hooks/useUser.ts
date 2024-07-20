import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateUserKey } from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();

  // get details on the userId
  const { userId, userToken } = useLoginData();
  // TODO: call useQuery to update user data from server
  const { data: user } = useQuery({
    // enabled 조건이 충족하지 않으면 해당 쿼리 함수는 실행되지 않는다.
    // userId가 null 즉, 사용자가 로그인하거나 로그아웃할 때 useQuery는 쿼리가 활성화되었는지를 확인한다.
    // 활성화된 상태라면 데이터를 가져오고
    // 활성화되지 않았다면 데이터를 가져오는 것에 신경 쓰지 않는다.
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
    // 이 데이터는 사용자가 스스로 업데이트할 경우에만 변경
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUser() {
    queryClient.removeQueries({ queryKey: [queryKeys.user] });
  }

  return { user, updateUser, clearUser };
}
