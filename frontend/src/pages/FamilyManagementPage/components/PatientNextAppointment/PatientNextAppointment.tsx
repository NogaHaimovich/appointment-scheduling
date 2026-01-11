import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { formatAppointmentDate, formatTimeToDisplay } from "../../../../utils/dateFormat";
import "./styles.scss";

type PatientNextAppointmentProps = {
    doctorName: string;
    date: string;
    time: string;
};

const PatientNextAppointment = ({ doctorName, date, time }: PatientNextAppointmentProps) => {
    const formattedDate = formatAppointmentDate(date);
    const formattedTime = formatTimeToDisplay(time, date);
    
    return (
        <div className="patient_detail_item patient_detail_item--next">
            <CalendarTodayIcon sx={{ fontSize: 16 }} />
            <span>Next: {doctorName}, {formattedDate} at {formattedTime}</span>
        </div>
    );
};

export default PatientNextAppointment;

