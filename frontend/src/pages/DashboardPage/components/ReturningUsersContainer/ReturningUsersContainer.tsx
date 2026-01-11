import { useNavigate } from "react-router-dom";
import type { AppointmentProps } from "../../../../types/types";
import Button from "../../../../components/Button/Button";
import AppointmentsSection from "../AppointmentsSection/AppointmentsSection";
import { useAppointmentFilters } from "../../../../hooks/useAppointmentFilters";

import "./styles.scss"

type ReturningUsersContainerProps = {
  upcomingAppointments: AppointmentProps[];
  pastAppointments: AppointmentProps[];
  accountName: string | null;
}

const ReturningUsersContainer = ({ upcomingAppointments, pastAppointments, accountName}: ReturningUsersContainerProps) => {
  const navigate = useNavigate();

  const upcoming = useAppointmentFilters(upcomingAppointments);
  const past = useAppointmentFilters(pastAppointments);

  const welcomeText = accountName ? `Welcome Back, ${accountName}!` : "Welcome Back!";

  return (
    <div className="dashboardPage__returning-account">
      <h1 className="dashboardPage__returning-account__header">
        {welcomeText}
      </h1>

      <div className="dashboardPage__family-button-container">
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

      <Button
        className="dashboardPage__button"
        onClick={() => navigate("/booking")}
      >
        Schedule New appointment
      </Button>

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
