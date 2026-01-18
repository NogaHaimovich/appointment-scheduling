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
  patients: string[];
  selectedPatient: string | null;
  onPatientChange: (value: string | null) => void;
}

const AppointmentsSection = ({ title, appointments, doctors, selectedDoctor, onDoctorChange, showButtons, emptyText, patients, selectedPatient, onPatientChange}: AppointmentsSectionProps) => {
  const hasAppointments = appointments.length > 0;

  return (
    <>
      <div className="appointments-header">
        <h2>{title}</h2>

        {(doctors.length > 0 || patients.length > 0) && (
          <div className="appointments-header__filters">
            {doctors.length > 0 && (
              <select
                className="dashboardPage__filter"
                value={selectedDoctor ?? ""}
                onChange={(e) => onDoctorChange(e.target.value || null)}
              >
                <option value="">All Doctors</option>
                {doctors.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}

            {patients.length > 0 && (
              <select
                className="dashboardPage__filter"
                value={selectedPatient ?? ""}
                onChange={(e) => onPatientChange(e.target.value || null)}
              >
                <option value="">All Patients</option>
                {patients.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {hasAppointments ? (
        <AppointmentGrid
          appointmentsList={appointments}
          showButtons={showButtons}
        />
      ) : (
        <h3 className="empty-text-session">{emptyText}</h3>
      )}
    </>
  );
};

export default AppointmentsSection;
