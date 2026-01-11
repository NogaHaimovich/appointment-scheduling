import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { formatAppointmentDate } from "../../../../utils/dateFormat";
import "./styles.scss";

type PatientNextAppointmentProps = {
    doctorName: string;
    date: string;
};

const PatientNextAppointment = ({ doctorName, date }: PatientNextAppointmentProps) => {
    return (
        <div className="patient_detail_item patient_detail_item--next">
            <CalendarTodayIcon sx={{ fontSize: 16 }} />
            <span>Next: {doctorName}, {formatAppointmentDate(date)}</span>
        </div>
    );
};

export default PatientNextAppointment;

