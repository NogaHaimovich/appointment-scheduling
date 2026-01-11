import { useNavigate } from "react-router-dom";
import type { AppointmentProps, Patient } from "../../../../types/types";
import Button from "../../../../components/Button/Button";
import AppointmentsSection from "../AppointmentsSection/AppointmentsSection";
import HighlightsSection from "../HighlightsSection/HighlightsSection";
import { useAppointmentFilters } from "../../../../hooks/useAppointmentFilters";

import "./styles.scss"

type ReturningUsersContainerProps = {
  upcomingAppointments: AppointmentProps[];
  pastAppointments: AppointmentProps[];
  accountName: string | null;
  patients: Patient[];
}

const ReturningUsersContainer = ({ upcomingAppointments, pastAppointments, accountName, patients}: ReturningUsersContainerProps) => {
  const navigate = useNavigate();

  const upcoming = useAppointmentFilters(upcomingAppointments);
  const past = useAppointmentFilters(pastAppointments);

  const welcomeText = accountName ? `Welcome Back, ${accountName}!` : "Welcome Back!";

  return (
    <div className="dashboardPage__returning-account">
      <h1 className="dashboardPage__returning-account__header">
        {welcomeText}
      </h1>

      <HighlightsSection
        upcomingCount={upcomingAppointments.length}
        historyCount={pastAppointments.length}
        familyMembersCount={patients.length}
      />

      <div className="dashboardPage__actions-buttons-container">
        <Button className="dashboardPage__button" onClick={() => navigate("/booking")}>
          Schedule New appointment
        </Button>
        <Button className="dashboardPage__button dashboardPage__button--secondary" onClick={() => navigate("/familyManagement")}>
          Manage Family Members
        </Button>
      </div>

      <AppointmentsSection
        title="Upcoming Appointments"
        appointments={upcoming.filteredAppointments}
        doctors={upcoming.doctors}
        selectedDoctor={upcoming.selectedDoctor}
        onDoctorChange={upcoming.setSelectedDoctor}
        showButtons
        emptyText="You don't have upcoming appointments"
        patients={upcoming.patients}
        selectedPatient={upcoming.selectedPatient}
        onPatientChange={upcoming.setSelectedPatient}
      />


      <AppointmentsSection
        title="Past Appointment History"
        appointments={past.filteredAppointments}
        doctors={past.doctors}
        selectedDoctor={past.selectedDoctor}
        onDoctorChange={past.setSelectedDoctor}
        showButtons={false}
        emptyText="You don't have appointment history"
        patients={past.patients}
        selectedPatient={past.selectedPatient}
        onPatientChange={past.setSelectedPatient}
      />
    </div>
  );
};

export default ReturningUsersContainer;
