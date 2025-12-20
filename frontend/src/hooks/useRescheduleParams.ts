import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type RescheduleParams = {
  appointmentId: number;
  specialty?: string;
  doctor?: string;
} | null;

export const useRescheduleParams = (): {
  rescheduleParams: RescheduleParams;
  isRescheduleMode: boolean;
} => {
  const [searchParams] = useSearchParams();

  const rescheduleParams = useMemo<RescheduleParams>(() => {
    const appointmentId = searchParams.get("appointmentId");
    if (!appointmentId) return null;

    return {
      appointmentId: parseInt(appointmentId),
      specialty: searchParams.get("specialty") || undefined,
      doctor: searchParams.get("doctor") || undefined,
    };
  }, [searchParams]);

  return {
    rescheduleParams,
    isRescheduleMode: !!rescheduleParams,
  };
};
