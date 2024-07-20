import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/app/toast";
import { queryKeys } from "@/react-query/constants";

export const MUTATION_KEY = "patch-user";

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
}

export function usePatchUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: () => {
      toast({ title: "user updated!", status: "success" });
    },
    // onSettled = onSuccess + onError
    // mutation이 끝나면 성공이든 오류든 상관없이 실행된다.
    onSettled: () => {
      // invalidateQueries가 완료되고 서버에서 새로운 데이터를 받을 때까지
      // mutation이 진행 중인 상태를 유지하기 위해 Promise를 반환해야 함 (return 명시!)
      return queryClient.invalidateQueries({
        queryKey: [queryKeys.user],
      });
    },
  });

  return patchUser;
}
