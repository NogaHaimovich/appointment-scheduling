import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { usePatients } from "../hooks/usePatients";

type PatientsContextType = ReturnType<typeof usePatients>;

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider = ({ children }: { children: ReactNode }) => {
  const patientsData = usePatients();

  return (
    <PatientsContext.Provider value={patientsData}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatientsContext = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error("usePatientsContext must be used within a PatientsProvider");
  }
  return context;
};

