import { useState, useMemo, useRef, useEffect } from "react";
import { type Dayjs } from "dayjs";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { AppointmentProps } from "../../../../types/types";

import "./styles.scss";

type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

interface CalendarViewProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  appointments?: AppointmentProps[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateChange,
  appointments = [],
}) => {
  const [view, setView] = useState<CalendarViewType>("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);
  const currentDate = selectedDate || dayjs();

  // Convert appointments to FullCalendar events
  const events = useMemo(() => {
    return appointments
      .filter((apt) => apt.date && apt.time) // Filter out invalid appointments
      .map((apt) => {
        const appointmentDate = dayjs(apt.date);
        if (!appointmentDate.isValid()) {
          return null;
        }

        const timeParts = apt.time.split(":");
        const hour = parseInt(timeParts[0], 10) || 0;
        const minute = parseInt(timeParts[1] || "0", 10) || 0;
        const startDateTime = appointmentDate.hour(hour).minute(minute).second(0);
        
        if (!startDateTime.isValid()) {
          return null;
        }
        
        // Get color for appointment
        const colors = [
          "#3f51b5", // blue
          "#4caf50", // green
          "#ff9800", // orange
          "#9c27b0", // purple
        ];
        let color = colors[0];
        if (apt.patient_id) {
          const hash = apt.patient_id.charCodeAt(0) % colors.length;
          color = colors[hash];
        } else {
          color = colors[apt.id % colors.length];
        }

        const displayName = apt.patient_name || apt.doctor_name || "Appointment";
        const timeStr = startDateTime.format("h:mm A");

        return {
          id: apt.id.toString(),
          title: `${timeStr} ${displayName}`,
          start: startDateTime.toISOString(),
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            appointment: apt,
          },
        };
      })
      .filter((event) => event !== null) as Array<{
        id: string;
        title: string;
        start: string;
        backgroundColor: string;
        borderColor: string;
        extendedProps: { appointment: AppointmentProps };
      }>;
  }, [appointments]);

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: CalendarViewType | null
  ) => {
    if (newView !== null && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDateClick = (clickInfo: DateClickArg) => {
    const clickedDate = dayjs(clickInfo.dateStr);
    onDateChange(clickedDate);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.start) {
      const eventDate = dayjs(clickInfo.event.start);
      onDateChange(eventDate);
    }
  };

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    // Sync view state with FullCalendar's current view
    const currentView = dateInfo.view.type as CalendarViewType;
    if (currentView !== view) {
      setView(currentView);
    }
    // Update selected date when calendar navigates
    if (dateInfo.view.type === "dayGridMonth") {
      const start = dayjs(dateInfo.start);
      const end = dayjs(dateInfo.end);
      const centerDate = start.add(end.diff(start) / 2);
      onDateChange(centerDate);
    } else {
      onDateChange(dayjs(dateInfo.start));
    }
  };

  // Sync calendar date when selectedDate changes externally
  useEffect(() => {
    if (calendarRef.current && selectedDate) {
      const calendarApi = calendarRef.current.getApi();
      const calendarDate = dayjs(calendarApi.getDate());
      if (!calendarDate.isSame(selectedDate, "day")) {
        calendarApi.gotoDate(selectedDate.toDate());
      }
    }
  }, [selectedDate]);

  return (
    <div className="calendar-view">
      <div className="calendar-view__header">
        <h2 className="calendar-view__title">Calendar</h2>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="calendar view"
          size="small"
          className="calendar-view__toggle"
        >
          <ToggleButton value="dayGridMonth" aria-label="month view">
            Month
          </ToggleButton>
          <ToggleButton value="timeGridWeek" aria-label="week view">
            Week
          </ToggleButton>
          <ToggleButton value="timeGridDay" aria-label="day view">
            Day
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="calendar-view__content">
        <div className="calendar-view__fullcalendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            initialDate={currentDate.toDate()}
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            height="auto"
            dayMaxEvents={3}
            moreLinkClick="popover"
            eventDisplay="block"
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

