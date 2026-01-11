import { useMutation } from "../../../../hooks/useMutation";
import { useNavigate } from "react-router-dom";
import { formatDateToDisplay, formatTimeToDisplay } from "../../../../utils/dateFormat";
import type { AppointmentProps, ApiMessageResponse } from "../../../../types/types";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import cardiologyImage from "../../../../images/cardiology.png";
import dermatologyImage from "../../../../images/dermatology.png";
import neurologyImage from "../../../../images/neurology.png";
import orthopedicsImage from "../../../../images/orthopedics.png";
import pediatricsImage from "../../../../images/pediatrics.png";

import "./styles.scss";
import PatientAvatar from "../../../../components/PatientAvatar/PatientAvatar";

export interface AppointmentCardProps extends AppointmentProps {
    showButtons: boolean;
}

const AppointmentCard = ({
    id,
    date,
    time,
    doctor_name,
    specialty_name,
    patient_id,
    patient_name,
    showButtons = false,
}: AppointmentCardProps) => {
    const navigate = useNavigate();

    const getSpecialtyImage = (specialtyName: string): string => {
  const imageMap: Record<string, string> = {
    "Cardiology": cardiologyImage,
    "Dermatology": dermatologyImage,
    "Neurology": neurologyImage,
    "Orthopedics": orthopedicsImage,
    "Pediatrics": pediatricsImage,
  };

  return imageMap[specialtyName] || "";
};
  
    const { mutate: cancelAppointment, loading: canceling, error } =
    useMutation<ApiMessageResponse, { accountId: string | null; appointmentId: number }>(
      "/appointments/assign",
      "patch"
    );

    const handleReschedule = () => {
        const params = new URLSearchParams({
            appointmentId: id.toString(),
        });
        
        if (specialty_name) params.append("specialty", specialty_name);
        if (doctor_name) params.append("doctor", doctor_name);
        if (date) params.append("date", date);
        if (time) params.append("time", time);
        if (patient_id) params.append("patientId", patient_id.toString());
        
        navigate(`/booking?${params.toString()}`);
    };

    const handleCancel = async () => {
        const formattedDate = formatDateToDisplay(date);
        const formattedTime = formatTimeToDisplay(time, date);
        const confirmMessage = `Are you sure you want to cancel your appointment on ${formattedDate} at ${formattedTime}?`;
        const confirmed = window.confirm(confirmMessage);
        
        if (!confirmed) {
            return; 
        }

        try {
            const result = await cancelAppointment({ accountId: null, appointmentId: id });
            if (result?.success) {
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
        }
    };

    const formattedDate = formatDateToDisplay(date);
    const formattedTime = formatTimeToDisplay(time, date);
    
    const formatDateMultiline = (dateStr: string): string[] => {
        if (!dateStr) return ['', '', ''];
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return [parts[0], parts[1], parts[2]]; 
        }
        return [dateStr, '', ''];
    };
    
    const dateParts = formatDateMultiline(formattedDate);

    return (
        <div className="appointment_cube">
            <div className="appointment_cube__left">
                <img
                    src={getSpecialtyImage(specialty_name)}
                    alt={specialty_name}
                    className="appointment_cube__specialty-icon"
                />
                <div className="appointment_cube__patient-label">PATIENT</div>
                <PatientAvatar patientId={patient_id?.toString() || ""} name={patient_name || ""} />
            </div>
            
            <div className="appointment_cube__right">
                {showButtons && (
                    <div className="appointment_cube__action-icons">
                        <button 
                            className="appointment_cube__edit-button"
                            onClick={handleReschedule}
                            aria-label="Reschedule appointment"
                        >
                            <EditIcon className="appointment_cube__edit-overlay" fontSize="small" />
                        </button>
                        <button 
                            className="appointment_cube__cancel-button"
                            onClick={handleCancel}
                            disabled={canceling}
                            aria-label="Cancel appointment"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                )}
                
                <h4 className="appointment_cube__doctor-name">{doctor_name}</h4>
                <div className="appointment_cube__specialty-name">{specialty_name}</div>
                
                <div className="appointment_cube__details">
                    <div className="appointment_cube__detail-item">
                        <CalendarTodayIcon className="appointment_cube__detail-icon" />
                        <div className="appointment_cube__detail-content">
                            <span className="appointment_cube__detail-label">DATE</span>
                            <span className="appointment_cube__detail-value appointment_cube__detail-value--multiline">
                                {dateParts.map((part, index) => (
                                    <span key={index}>{part}</span>
                                ))}
                            </span>
                        </div>
                    </div>
                    
                    <div className="appointment_cube__detail-item">
                        <AccessTimeIcon className="appointment_cube__detail-icon" />
                        <div className="appointment_cube__detail-content">
                            <span className="appointment_cube__detail-label">TIME</span>
                            <span className="appointment_cube__detail-value">{formattedTime}</span>
                        </div>
                    </div>
                </div>

                {error && <div className="appointment_cube__error-message">{error}</div>}
            </div>
        </div>
    );
};

export default AppointmentCard;

