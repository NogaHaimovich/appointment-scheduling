import type { FC } from "react";
import type { Doctor } from "../../../../types/types";
import "./styles.scss";

type DoctorSelectorProps = {
  selectedDoctor: string;
  doctors: Doctor[];
  selectedSpecialty: string;
  onChange: (doctor: string) => void;
  loading: boolean;
  disabled: boolean;
};

const DoctorSelector: FC<DoctorSelectorProps> = ({
  selectedDoctor,
  doctors,
  selectedSpecialty,
  onChange,
  loading,
  disabled,
}) => {
  if (disabled || !selectedSpecialty) {
    return (
      <div className="doctor-selection">
        <h3 className="doctor-selection-title">2. SPECIALIST</h3>
        <div className="doctor-selection-empty">
          Please select a specialty first
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-selection">
      <div className="doctor-selection-header">
        <h3 className="doctor-selection-title">2. SPECIALIST</h3>
        {doctors.length > 0 && (
          <span className="doctor-selection-count">
            {doctors.length} Found
          </span>
        )}
      </div>

      {loading ? (
        <div className="doctor-selection-loading">Loading doctors...</div>
      ) : (
        <div className="doctor-selection-list">
          {doctors.map((doctor) => {
            const isSelected = selectedDoctor === doctor.name;

            return (
              <div
                key={doctor.id}
                className={`doctor-item ${isSelected ? "selected" : ""}`}
                onClick={() =>
                  !disabled && !loading && onChange(doctor.name)
                }
              >
                <div className="doctor-item-content">
                  <div className="doctor-info">
                    <div className="doctor-name">{doctor.name}</div>
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
