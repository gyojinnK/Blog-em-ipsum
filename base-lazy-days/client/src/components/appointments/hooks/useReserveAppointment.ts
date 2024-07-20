import { Appointment } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? "replace" : "add";
  const patchData = [{ op: patchOp, path: "/userId", value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment() {
  const { userId } = useLoginData();
  const queryClient = useQueryClient();

  const toast = useCustomToast();

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.appointments],
        // queryKey의 앞부분이 queryKeys.appointments 동일한 모든 쿼리를 동시에 무효화 시킬 수 있음 (매우 유용!)
      });
      toast({ title: "You have reserved an appointment!", status: "success" });
    },
  });

  return mutate;
}
