import dayjs from "dayjs";
import type { FC } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { formatTimeToDisplay } from "../../../../utils/dateFormat";
import Button from "../../../../components/Button/Button";

import "./styles.scss";

type DateTimeSelectorProps = {
  groupedSlots: Record<string, string[]>;
  selectedDate: string;
  selectedTime: string;
  selectedDoctor: string;
  selectedSpecialty: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  loadingSlots: boolean;
  disable: boolean;
  isFormComplete: boolean;
  loading: boolean;
  error?: string | null;
  onConfirm: () => void;
  isReschedule?: boolean;
};

const DateTimeSelector: FC<DateTimeSelectorProps> = ({
  groupedSlots,
  selectedDate,
  selectedTime,
  selectedDoctor,
  selectedSpecialty,
  onDateChange,
  onTimeChange,
  loadingSlots,
  disable,
  isFormComplete,
  loading,
  error,
  onConfirm,
  isReschedule = false,
}) => {
  const availableDates = Object.keys(groupedSlots).sort();

  const availableTimesLocal = selectedDate
    ? (groupedSlots[selectedDate] || []).map((utcTime) =>
        formatTimeToDisplay(utcTime, selectedDate)
      )
    : [];

  const timeMapping = selectedDate
    ? (() => {
        const mapping: Record<string, string> = {};
        (groupedSlots[selectedDate] || []).forEach((utcTime) => {
          const localTime = formatTimeToDisplay(utcTime, selectedDate);
          mapping[localTime] = utcTime;
        });
        return mapping;
      })()
    : {};

  const isDateAvailable = (date: dayjs.Dayjs | null): boolean => {
    if (!date) return false;
    return availableDates.includes(date.format("YYYY-MM-DD"));
  };

  const handleCalendarDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate && isDateAvailable(newDate) && !disable && !loadingSlots) {
      onDateChange(newDate.format("YYYY-MM-DD"));
    }
  };

  const minDate =
    availableDates.length > 0 ? dayjs(availableDates[0]) : dayjs();
  const maxDate =
    availableDates.length > 0
      ? dayjs(availableDates[availableDates.length - 1])
      : undefined;

  const getMonthYear = (): string => {
    if (!availableDates.length) return "";
    return dayjs(availableDates[0]).format("MMMM YYYY");
  };

  const getSpecialtyDescription = (specialty: string): string => {
    const descriptions: Record<string, string> = {
      Cardiologist: "Specializes in heart failure & preventative cardiology.",
      Neurologist: "Specializes in neurological disorders & brain health.",
      Pediatrician: "Specializes in child health & development.",
      Dermatologist: "Specializes in skin conditions & dermatology.",
      "General Practitioner":
        "Specializes in general medicine & primary care.",
      Orthopedist: "Specializes in bone & joint health.",
      Psychiatrist: "Specializes in mental health & psychiatry.",
    };

    return descriptions[specialty] || `Specializes in ${specialty.toLowerCase()}.`;
  };

  return (
    <div className="date-time-container">
      <div className="availability-header">
        <h3 className="availability-title">3. AVAILABILITY</h3>
      </div>
      {availableDates.length > 0 && (
        <div className="date-selection-section">
          <div className="date-selection-label">SELECT DATE:</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleCalendarDateChange}
              minDate={minDate}
              maxDate={maxDate}
              shouldDisableDate={(date) => !isDateAvailable(date)}
              disabled={disable || loadingSlots}
              className="date-calendar"
            />
          </LocalizationProvider>
        </div>
      )}

      {selectedDate && (
        <div className="time-slots-section">
          <div className="time-slots-label">AVAILABLE SLOTS:</div>
          {availableTimesLocal.length > 0 ? (
            <div className="time-slots-grid">
              {availableTimesLocal.map((localTime, index) => {
                const utcTime = timeMapping[localTime];
                const isSelected = selectedTime === utcTime;

                return (
                  <button
                    key={`${localTime}-${index}`}
                    className={`time-slot-button ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => !disable && onTimeChange(utcTime)}
                    disabled={disable}
                  >
                    {localTime}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="no-slots-message">
              No available time slots for this date
            </div>
          )}
        </div>
      )}

      {!selectedDate && availableDates.length > 0 && (
        <div className="time-slots-section">
          <div className="time-slots-label">AVAILABLE SLOTS:</div>
          <div className="no-slots-message">Please select a date first</div>
        </div>
      )}

      {isFormComplete && (
        <div className="confirm-section">
          <Button
            onClick={onConfirm}
            loading={loading}
            disabled={disable || loading}
          >
            {isReschedule ? "Reschedule Appointment" : "Confirm Appointment"} →
          </Button>

          {error && <div className="booking-error">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
