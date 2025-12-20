import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import type { FC } from "react";

import "./styles.scss";

type DateTimeSelectorProps = {
  groupedSlots: Record<string, string[]>;
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  loadingSlots: boolean;
  disable: boolean;
};

const DateTimeSelector: FC<DateTimeSelectorProps> = ({ groupedSlots, selectedDate, selectedTime, onDateChange, onTimeChange, loadingSlots, disable
}) => {
  const availableDates = Object.keys(groupedSlots);
  
  const selectedDateValue = selectedDate ? dayjs(selectedDate) : null;
  
  const availableTimes = selectedDate ? groupedSlots[selectedDate] || [] : [];


  const shouldDisableDate = (date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    return !availableDates.includes(dateString);
  };


  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      const dateString = newDate.format("YYYY-MM-DD");
      onDateChange(dateString);
      onTimeChange(""); 
    }
  };

  return (
    <div className="date-time-container">
      <div className="calendar-section">
        <h3 className="section-title">Select Date</h3>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDateValue}
            onChange={handleDateChange}
            disabled={disable || loadingSlots}
            shouldDisableDate={shouldDisableDate}
            className="custom-date-calendar"
          />
        </LocalizationProvider>
      </div>

      {selectedDate && (
        <div className="time-slots-section">
          <h3 className="section-title">Select Time</h3>
          {availableTimes.length > 0 ? (
            <div className="time-slots-grid">
              {availableTimes.map((time, index) => (
                <button
                  key={`${time}-${index}`}
                  className={`time-slot-button ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => onTimeChange(time)}
                  disabled={disable}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="no-slots-message">
              No available time slots for this date
            </div>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="time-slots-section">
          <h3 className="section-title">Select Time</h3>
          <div className="no-slots-message">
            Please select a date first
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;

