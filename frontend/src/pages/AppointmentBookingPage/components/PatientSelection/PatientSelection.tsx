import type { FC } from "react";
import type { Patient } from "../../../../types/types";
import "./styles.scss";

type PatientSelectorProps = {
  selectedPatientId: string | null;
  patients: Patient[];
  onChange: (patientId: string | null) => void;
  loading: boolean;
  disabled?: boolean;
}

const PatientSelector: FC<PatientSelectorProps> = ({ 
  selectedPatientId, 
  patients, 
  onChange, 
  loading, 
  disabled 
}) => {
  const getPatientDisplayName = (patient: Patient) => {
    if (patient.relationship === 'self') {
      return patient.patient_name;
    }
    return `${patient.patient_name} (${patient.relationship})`;
  };

  return (
    <div className="patient-selection">
      <h3 className="patient-selection-title">1. PATIENT</h3>
      {loading ? (
        <div className="patient-selection-loading">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="patient-selection-empty">No patients found</div>
      ) : (
        <div className="patient-selection-list">
          {patients.map((patient) => {
            const isSelected = selectedPatientId === patient.id;
            return (
              <div
                key={patient.id}
                className={`patient-item ${isSelected ? 'selected' : ''}`}
                onClick={() => !disabled && !loading && onChange(patient.id)}
              >
                <div className="patient-content">
                  <span className="patient-name">{getPatientDisplayName(patient)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientSelector;

