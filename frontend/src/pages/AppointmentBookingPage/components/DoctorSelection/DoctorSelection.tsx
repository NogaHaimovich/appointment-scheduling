import type { FC } from "react";
import type { Doctor, AppointmentProps, LastVisitPerSpecialty } from "../../../../types/types";
import { formatDateToDisplay } from "../../../../utils/dateFormat";
import "./styles.scss";

type DoctorSelectorProps = {
  selectedDoctor: string;
  doctors: Doctor[];
  selectedSpecialty: string;
  onChange: (doctor: string) => void;
  loading: boolean;
  getNextAvailableSlot: (doctorId: number) => AppointmentProps | null;
  disabled: boolean;
  lastVisitPerSpecialty: LastVisitPerSpecialty[];
};


const DoctorSelector: FC<DoctorSelectorProps> = ({
  selectedDoctor,
  doctors,
  selectedSpecialty,
  onChange,
  loading,
  getNextAvailableSlot,
  disabled,
  lastVisitPerSpecialty,
}) => {
  return (
    <div className="doctor-selection">
      <div className="doctor-selection-header">
        <h3 className="doctor-selection-title">3. DOCTORS</h3>
      </div>

      {loading ? (
        <div className="doctor-selection-loading">Loading doctors...</div>
      ) : (
        <div className="doctor-selection-list">
          {doctors.map((doctor) => {
            const isSelected = selectedDoctor === doctor.name;
            const nextAvailableSlot = getNextAvailableSlot(doctor.id);
            const nextAvailableText = nextAvailableSlot
              ? formatDateToDisplay(nextAvailableSlot.date)
              : null;

            const lastVisit = lastVisitPerSpecialty.find(visit => visit.doctorId === doctor.id);

            return (
              <div
                key={doctor.id}
                className={`doctor-card ${isSelected ? "selected" : ""}`}
                onClick={() => !disabled && !loading && onChange(doctor.name)}
              >
                {lastVisit && (
                  <div className="visited-doctor-badge">
                    YOU VISITED THIS DOCTOR
                  </div>
                )}

                <div className="doctor-card-content">
                  <div className="doctor-info">
                    <div className="doctor-name">{doctor.name}</div>
                    <div className={`doctor-specialty ${isSelected ? "selected" : ""}`}>
                      {selectedSpecialty}
                    </div>

                    <div className="doctor-badges">
                      {nextAvailableText && (
                        <div className="badge next-available-badge">
                          Next available: <strong>{nextAvailableText}</strong>
                        </div>
                      )}

                      {!nextAvailableText && (
                        <div className="badge no-slots-badge">
                          No available slots
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;
