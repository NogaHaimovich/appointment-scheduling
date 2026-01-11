import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PatientBadge from "../PatientBadge/PatientBadge";
import PatientNextAppointment from "../PatientNextAppointment/PatientNextAppointment";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import type { Patient } from "../../types/patientTypes";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import PatientAvatar from "../../../../components/PatientAvatar/PatientAvatar";

type PatientCardProps = {
    patient: Patient;
    onDelete: (patientId: string) => Promise<void>;
    deleting?: boolean;
};

const PatientCard = ({ patient, onDelete, deleting = false }: PatientCardProps) => {
    const navigate = useNavigate();
    const isSelf = patient.relationship.toLowerCase() === "self";
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await onDelete(patient.id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };

    const handleCloseModal = () => {
        if (!deleting) {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="patient_box">
            <div className="patient_card">
                {!isSelf && (
                    <button 
                        className="patient_delete_button"
                        onClick={handleDeleteClick}
                        aria-label="Delete patient"
                        disabled={deleting}
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
                    {patient.nextAppointment ? (
                        <PatientNextAppointment 
                            doctorName={patient.nextAppointment.doctorName}
                            date={patient.nextAppointment.date}
                            time={patient.nextAppointment.time}
                        />
                    ) : (
                        <div className="patient_detail_item patient_detail_item--no-appointment">
                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                            <span>No upcoming appointments</span>
                        </div>
                    )}
                </div>

                <div className="patient_actions">
                    <button 
                        className="patient_action_button patient_action_button--secondary"
                        onClick={() => navigate(`/booking?patientId=${patient.id}`)}
                    >
                        Book Appointment
                    </button>
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                patientName={patient.name}
                loading={deleting}
            />
        </div>
    );
};

export default PatientCard;

