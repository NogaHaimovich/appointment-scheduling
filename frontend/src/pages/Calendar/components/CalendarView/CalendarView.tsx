import { useEffect, useMemo, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import type { AppointmentProps } from "../../../../types/types";
import "./styles.scss";

type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

interface CalendarViewProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  appointments?: AppointmentProps[];
}


const COLORS = ["#3f51b5", "#4caf50", "#ff9800", "#9c27b0"];

const getEventColor = (apt: AppointmentProps): string => {
  if (apt.patient_id) {
    return COLORS[apt.patient_id.charCodeAt(0) % COLORS.length];
  }
  return COLORS[apt.id % COLORS.length];
};

const buildEvent = (apt: AppointmentProps): EventInput | null => {
  if (!apt.date || !apt.time) return null;

  const start = dayjs(`${apt.date} ${apt.time}`);
  if (!start.isValid()) return null;

  return {
    id: apt.id.toString(),
    title: `${start.format("h:mm A")} ${
      apt.patient_name ?? apt.doctor_name ?? "Appointment"
    }`,
    start: start.toISOString(),
    backgroundColor: getEventColor(apt),
    borderColor: getEventColor(apt),
    extendedProps: {
      appointment: apt,
    },
  };
};



const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateChange,
  appointments = [],
}) => {
  const [view, setView] = useState<CalendarViewType>("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);


  const events = useMemo<EventInput[]>(
    () =>
      appointments
        .map(buildEvent)
        .filter((event): event is EventInput => event !== null),
    [appointments]
  );


  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: CalendarViewType | null
  ) => {
    if (!newView || !calendarRef.current) return;

    setView(newView);
    calendarRef.current.getApi().changeView(newView);
  };

  const handleDateClick = (info: DateClickArg) => {
    onDateChange(dayjs(info.date));
  };

  const handleEventClick = (info: EventClickArg) => {
    if (info.event.start) {
      onDateChange(dayjs(info.event.start));
    }
  };


  useEffect(() => {
    if (!calendarRef.current || !selectedDate) return;
    calendarRef.current.getApi().gotoDate(selectedDate.toDate());
  }, [selectedDate]);


  return (
    <div className="calendar-view">
      <div className="calendar-view__header">
        <h2 className="calendar-view__title">Calendar</h2>

        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          onChange={handleViewChange}
          className="calendar-view__toggle"
        >
          <ToggleButton value="dayGridMonth">Month</ToggleButton>
          <ToggleButton value="timeGridWeek">Week</ToggleButton>
          <ToggleButton value="timeGridDay">Day</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="calendar-view__content">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          initialDate={selectedDate?.toDate()}
          events={events}
          height="auto"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventDisplay="block"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
