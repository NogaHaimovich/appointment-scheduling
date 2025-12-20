import { useNavigate } from "react-router-dom";
import type { AppointmentProps } from "../../../../types/types";
import Button from "../../../../components/Button/Button";
import AppointmentsSection from "../AppointmentsSection/AppointmentsSection";
import { useDoctorFilter } from "../../../../hooks/useDoctorFilter";

import "./styles.scss"

type ReturningUsersContainerProps = {
  upcomingAppointments: AppointmentProps[];
  pastAppointments: AppointmentProps[];
}

const ReturningUsersContainer = ({ upcomingAppointments, pastAppointments}: ReturningUsersContainerProps) => {
  const navigate = useNavigate();

  const upcoming = useDoctorFilter(upcomingAppointments);
  const past = useDoctorFilter(pastAppointments);

  return (
    <div className="dashboardPage__returning-user">
      <h1 className="dashboardPage__returning-user__header">
        Welcome Back!
      </h1>

      <AppointmentsSection
        title="Upcoming Appointments"
        appointments={upcoming.filteredAppointments}
        doctors={upcoming.doctors}
        selectedDoctor={upcoming.selectedDoctor}
        onDoctorChange={upcoming.setSelectedDoctor}
        showButtons
        emptyText="You don't have upcoming appointments"
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
      />
    </div>
  );
};

export default ReturningUsersContainer;
