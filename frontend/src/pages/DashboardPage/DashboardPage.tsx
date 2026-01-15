import { useMemo } from "react";
import { useData } from "../../hooks/useData";
import { usePatientsContext } from "../../contexts/PatientsContext";
import { useAppointmentsContext } from "../../contexts/AppointmentsContext";
import { API_ENDPOINTS } from "../../config/api";

import "./styles.scss";
import NewUserContainer from "./components/NewUsersContainer/NewUsersContainer";
import ReturningUsersContainer from "./components/ReturningUsersContainer/ReturningUsersContainer";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import type { SpecialitiesResponse } from "../../types/types";

const DashboardPage = () => {
  const { 
    upcomingAppointments, 
    pastAppointments, 
    accountName, 
    loadingAppointments, 
    error 
  } = useAppointmentsContext();
  const { patients } = usePatientsContext();

  const hasAppointments = useMemo(
    () => upcomingAppointments.length > 0 || pastAppointments.length > 0,
    [upcomingAppointments, pastAppointments]
  );

  const shouldLoadSpecialties = !loadingAppointments && !hasAppointments;
  const { data: specialtiesData, loading: loadingSpecialties } = useData<SpecialitiesResponse>(
    API_ENDPOINTS.getSpecialties,
    0,
    undefined,
    shouldLoadSpecialties
  );

  if (loadingAppointments)
    return (
      <div className="dashboardPage_container">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return <div className="dashboardPage_container">Error loading appointments</div>;

  if (!hasAppointments && (loadingSpecialties || !specialtiesData))
    return (
      <div className="dashboardPage_container">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="dashboardPage_container">
      {!hasAppointments ? (
        <NewUserContainer specialties={specialtiesData} accountName={accountName} />
      ) : (
        <ReturningUsersContainer
          upcomingAppointments={upcomingAppointments} 
          pastAppointments={pastAppointments}
          accountName={accountName}
          patients={patients}
        />
      )}
    </div>
  );
}

export default DashboardPage;
