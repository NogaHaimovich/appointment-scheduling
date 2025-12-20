import { useMemo } from "react";
import { useData } from "../../hooks/useData";
import { API_ENDPOINTS } from "../../config/api";
import { authUtils } from "../../utils/auth";

import "./styles.scss";
import NewUserContainer from "./components/NewUsersContainer/NewUsersContainer";
import ReturningUsersContainer from "./components/ReturningUsersContainer/ReturningUsersContainer";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import type { AppointmentsResponse, SpecialitiesResponse } from "../../types/types";

const DashboardPage = () => {
  const userId = authUtils.getUserIdFromToken();
  const requestBody = useMemo(() => ({ userId }), [userId]);
  const { data, loading, error } = useData<AppointmentsResponse>( API_ENDPOINTS.getUserAppointments, 0, requestBody );

  const { upcomingAppointments, pastAppointments } = useMemo(
    () => ({
      upcomingAppointments: data?.upcomingAppointment ?? [],
      pastAppointments: data?.appointmentHistory ?? [],
    }),
    [data]
  );

  const hasAppointments = useMemo(
    () => upcomingAppointments.length > 0 || pastAppointments.length > 0,
    [upcomingAppointments, pastAppointments]
  );

  const shouldLoadSpecialties = !loading && !!data && !hasAppointments;
  const { data: specialtiesData, loading: loadingSpecialties } = useData<SpecialitiesResponse>(
    API_ENDPOINTS.getSpecialties,
    0,
    undefined,
    shouldLoadSpecialties
  );

  if (loading || !data)
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
        <NewUserContainer specialties={specialtiesData} />
      ) : (
        <ReturningUsersContainer
          upcomingAppointments={upcomingAppointments} 
          pastAppointments={pastAppointments}
        />
      )}
    </div>
  );
}

export default DashboardPage;
