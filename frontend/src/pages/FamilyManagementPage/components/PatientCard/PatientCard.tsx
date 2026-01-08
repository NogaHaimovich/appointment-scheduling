import CloseIcon from "@mui/icons-material/Close";
import PatientAvatar from "../PatientAvatar/PatientAvatar";
import PatientBadge from "../PatientBadge/PatientBadge";
import PatientNextAppointment from "../PatientNextAppointment/PatientNextAppointment";
import type { Patient } from "../../types/patientTypes";
import "./styles.scss";

type PatientCardProps = {
    patient: Patient;
    onBookAppointment: (patientId: number) => void;
    onDeletePatient: (patientId: number) => void;
};

const PatientCard = ({ patient, onBookAppointment, onDeletePatient }: PatientCardProps) => {
    const isSelf = patient.relationship.toLowerCase() === "self";

    return (
        <div className="patient_box">
            <div className="patient_card">
                {!isSelf && (
                    <button 
                        className="patient_delete_button"
                        onClick={() => onDeletePatient(patient.id)}
                        aria-label="Delete patient"
                    >
                        <CloseIcon />
                    </button>
                )}
                <div className="patient_header">
                    <PatientAvatar patientId={patient.id} name={patient.name} />
                    <div className="patient_info">
                        <h3 className="patient_name">{patient.name}</h3>
                        <PatientBadge relationship={patient.relationship} isAdmin={patient.isAdmin} />
                    </div>
                </div>
                
                <div className="patient_details">
                    {patient.nextAppointment && (
                        <PatientNextAppointment 
                            doctorName={patient.nextAppointment.doctorName}
                            date={patient.nextAppointment.date}
                        />
                    )}
                </div>

                <div className="patient_actions">
                    <button 
                        className="patient_action_button patient_action_button--secondary"
                        onClick={() => onBookAppointment(patient.id)}
                    >
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientCard;

