import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAppointments } from "../hooks/useAppointments";

type AppointmentsContextType = ReturnType<typeof useAppointments>;

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const appointmentsData = useAppointments();

  return (
    <AppointmentsContext.Provider value={appointmentsData}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointmentsContext = () => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error("useAppointmentsContext must be used within an AppointmentsProvider");
  }
  return context;
};

