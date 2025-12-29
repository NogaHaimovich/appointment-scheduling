import { useMutation } from "../../../../hooks/useMutation";
import { useNavigate } from "react-router-dom";
import { formatDateToDisplay, formatTimeToDisplay } from "../../../../utils/dateFormat";
import Button from "../../../../components/Button/Button";
import type { AppointmentProps, ApiMessageResponse } from "../../../../types/types";

import "./styles.scss"

export interface AppointmentCardProps extends AppointmentProps {
    showButtons: boolean;
}

const AppointmentCard = ({
    id,
    date,
    time,
    doctor_name,
    specialty_name,
    showButtons = false,
}: AppointmentCardProps) => {
    const navigate = useNavigate();
  
    const { mutate: cancelAppointment, loading: canceling, error } =
    useMutation<ApiMessageResponse, { userId: string | null; appointmentId: number }>(
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
            const result = await cancelAppointment({ userId: null, appointmentId: id });
            if ((result as any)?.success) {
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
        }
    };

    const formattedDate = formatDateToDisplay(date);
    const formattedTime = formatTimeToDisplay(time, date);

    return (
        <div className="appointment_cube">
            <h5>Date: {formattedDate}, {formattedTime}</h5>
            <h5>Dr: {doctor_name}</h5>
            <h5>Speciality: {specialty_name}</h5>

            {error && <div className="error-message">{error}</div>}

            {showButtons && (
                <div className="buttons_row">
                    <Button variant="info" onClick={handleReschedule}>Reschedule</Button>
                    <Button variant="danger" onClick={handleCancel} loading={canceling} disabled={canceling}>
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AppointmentCard

