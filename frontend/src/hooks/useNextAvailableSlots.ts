import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { API_ENDPOINTS } from "../config/api";
import type { NextAvailableSlotResponse, AppointmentProps, Doctor } from "../types/types";

export const useNextAvailableSlots = (doctors: Doctor[]) => {
  const [nextAvailableSlots, setNextAvailableSlots] = useState<Record<number, AppointmentProps | null>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctors.length === 0) {
      setNextAvailableSlots({});
      return;
    }

    const fetchNextAvailableSlots = async () => {
      setLoading(true);
      const slotsMap: Record<number, AppointmentProps | null> = {};

      try {
        const promises = doctors.map(async (doctor) => {
          try {
            const response = await axios.get<NextAvailableSlotResponse>(
              `${API_BASE_URL}${API_ENDPOINTS.getNextAvailableSlot}`,
              {
                params: { doctorId: doctor.id },
              }
            );
            slotsMap[doctor.id] = response.data.nextAvailable || null;
          } catch (error) {
            console.error(`Error fetching next available slot for doctor ${doctor.id}:`, error);
            slotsMap[doctor.id] = null;
          }
        });

        await Promise.all(promises);
        setNextAvailableSlots(slotsMap);
      } catch (error) {
        console.error("Error fetching next available slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextAvailableSlots();
  }, [doctors]);

  const getNextAvailableSlot = useMemo(() => {
    return (doctorId: number): AppointmentProps | null => {
      return nextAvailableSlots[doctorId] || null;
    };
  }, [nextAvailableSlots]);

  return {
    nextAvailableSlots,
    getNextAvailableSlot,
    loadingNextAvailableSlots: loading,
  };
};

