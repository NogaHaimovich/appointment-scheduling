import Button from "../../../../components/Button/Button";
import { formatDateToDisplay } from "../../../../utils/dateFormat";
import "./styles.scss"

type AppointmentSummaryProps = {
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  loading: boolean;
  error?: string | null;
  onConfirm: () => void;
  isReschedule?: boolean;
  disabled?: boolean;
}

const AppointmentSummary = ({ specialty, doctor, date, time, loading, error, onConfirm, isReschedule = false, disabled = false}: AppointmentSummaryProps) => {
  const formattedDate = formatDateToDisplay(date);
  
  return (
    <div className="appointment-summary">
      <h3 className="summary-title">Appointment Summary</h3>

      <div className="summary-content">
        <SummaryRow label="Specialty" value={specialty} />
        <SummaryRow label="Doctor" value={doctor} />
        <SummaryRow label="Date" value={formattedDate} />
        <SummaryRow label="Time" value={time} />
      </div>

      {error && <div className="summary-error">{error}</div>}

      <Button onClick={onConfirm} loading={loading} disabled={disabled || loading}>
        {isReschedule ? "Reschedule Appointment" : "Schedule Appointment"}
      </Button>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="summary-row">
    <span className="summary-label">{label}: </span>
    <span className="summary-value">{value}</span>
  </div>
);

export default AppointmentSummary;

