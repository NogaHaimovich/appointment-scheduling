import type { AppointmentProps } from "../../../../types/types";
import AppointmentGrid from "../AppointmentsGrid/AppointmentsGrid";
import "./style.scss"


type AppointmentsSectionProps = {
  title: string;
  appointments: AppointmentProps[];
  doctors: string[];
  selectedDoctor: string | null;
  onDoctorChange: (value: string | null) => void;
  showButtons: boolean;
  emptyText: string;
}

const AppointmentsSection = ({ title, appointments, doctors, selectedDoctor, onDoctorChange, showButtons, emptyText}: AppointmentsSectionProps) => {
  if (appointments.length === 0) {
    return <h3>{emptyText}</h3>;
  }

  return (
    <>
      <div className="appointments-header">
        <h3>{title}</h3>

        {doctors.length > 0 && (
          <select
            className="dashboardPage__doctor-filter"
            value={selectedDoctor ?? ""}
            onChange={(e) => onDoctorChange(e.target.value || null)}
          >
            <option value="">All doctors</option>
            {doctors.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      <AppointmentGrid
        appointmentsList={appointments}
        showButtons={showButtons}
      />
    </>
  );
};

export default AppointmentsSection;
