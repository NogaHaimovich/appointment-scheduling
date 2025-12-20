import { useMemo } from "react";
import { useData } from "../../hooks/useData";
import { API_ENDPOINTS } from "../../config/api";
import { authUtils } from "../../utils/auth";

import "./styles.scss";
import NewUserContainer from "./components/NewUsersContainer/NewUsersContainer";
import ReturningUsersContainer from "./components/ReturningUsersContainer/ReturningUsersContainer";
import type { AppointmentsResponse } from "../../types/types";

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

  if (loading || !data)
    return <div className="dashboardPage_container">Loading appointments...</div>;

  if (error)
    return <div className="dashboardPage_container">Error loading appointments</div>;

  const hasAppointments =
    upcomingAppointments.length > 0 || pastAppointments.length > 0;

  return (
    <div className="dashboardPage_container">
      {!hasAppointments ? (
        <NewUserContainer/>
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
