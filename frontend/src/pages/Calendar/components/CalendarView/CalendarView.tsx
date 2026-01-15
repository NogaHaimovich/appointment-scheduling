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
import { useAppointmentsContext } from "../../../../contexts/AppointmentsContext";
import type { AppointmentProps, Patient } from "../../../../types/types";

import "./styles.scss";

type CalendarViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay";
type PatientWithColor = Patient & { color: string };

const getPatientColor = (colorName: string): string => {
  const cssVar = `--color-patient-${colorName}`;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim() || "#89cff0"
  );
};

interface CalendarViewProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  patientsWithColors: PatientWithColor[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateChange,
  patientsWithColors,
}) => {
  const { upcomingAppointments, pastAppointments } =
    useAppointmentsContext();

  const appointments = useMemo(
    () => [...upcomingAppointments, ...pastAppointments],
    [upcomingAppointments, pastAppointments]
  );

  const [view, setView] = useState<CalendarViewType>("dayGridMonth");
  const calendarRef = useRef<FullCalendar>(null);
  const isViewChangingRef = useRef(false);
  const isUpdatingFromParentRef = useRef(false);
  const previousDateRangeRef = useRef<{
    start: string;
    end: string;
    view: string;
  } | null>(null);

  const currentDate = selectedDate || dayjs();

  const visiblePatientIds = useMemo(() => {
    return new Set(patientsWithColors.map((p) => p.id));
  }, [patientsWithColors]);


  const patientColorMap = useMemo(() => {
    const map = new Map<string, string>();
    patientsWithColors.forEach((patient) => {
      map.set(patient.id, getPatientColor(patient.color));
    });
    return map;
  }, [patientsWithColors]);

  const events = useMemo(() => {
    return appointments
      .filter(
        (apt) =>
          apt.date &&
          apt.time &&
          apt.patient_id &&
          visiblePatientIds.has(apt.patient_id)
      )
      .map((apt) => {
        const appointmentDate = dayjs(apt.date);
        if (!appointmentDate.isValid()) return null;

        const [hourStr, minuteStr] = apt.time.split(":");
        const hour = parseInt(hourStr, 10) || 0;
        const minute = parseInt(minuteStr || "0", 10) || 0;

        const startDateTime = appointmentDate
          .hour(hour)
          .minute(minute)
          .second(0);

        if (!startDateTime.isValid()) return null;

        const color =
          patientColorMap.get(apt.patient_id!) ||
          getPatientColor("blue");

        const displayName =
          apt.patient_name || apt.doctor_name || "Appointment";

        return {
          id: apt.id.toString(),
          title: `${startDateTime.format("h:mm A")} ${displayName}`,
          start: startDateTime.toISOString(),
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            appointment: apt,
          },
        };
      })
      .filter(Boolean) as {
      id: string;
      title: string;
      start: string;
      backgroundColor: string;
      borderColor: string;
      extendedProps: { appointment: AppointmentProps };
    }[];
  }, [appointments, visiblePatientIds, patientColorMap]);


  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: CalendarViewType | null
  ) => {
    if (newView && calendarRef.current && selectedDate) {
      const api = calendarRef.current.getApi();
      isViewChangingRef.current = true;
      api.changeView(newView);
      setTimeout(() => {
        api.gotoDate(selectedDate.toDate());
        setView(newView);
        setTimeout(() => {
          isViewChangingRef.current = false;
        }, 50);
      }, 10);
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    onDateChange(dayjs(info.dateStr));
  };

  const handleEventClick = (info: EventClickArg) => {
    if (info.event.start) {
      onDateChange(dayjs(info.event.start));
    }
  };

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const currentView = dateInfo.view.type as CalendarViewType;

    if (currentView !== view) setView(currentView);
    
    if (!isUpdatingFromParentRef.current && calendarRef.current) {
      const api = calendarRef.current.getApi();
      const calendarCurrentDate = dayjs(api.getDate());
      
      if (!selectedDate || !calendarCurrentDate.isSame(selectedDate, 'day')) {
        onDateChange(calendarCurrentDate);
      }
    }
    
    previousDateRangeRef.current = {
      start: dateInfo.startStr,
      end: dateInfo.endStr,
      view: currentView,
    };
  };

  useEffect(() => {
    if (!calendarRef.current || !selectedDate) return;

    const api = calendarRef.current.getApi();
    const viewStart = dayjs(api.view.activeStart);
    const viewEnd = dayjs(api.view.activeEnd);

    if (
      selectedDate.isBefore(viewStart) ||
      selectedDate.isAfter(viewEnd)
    ) {
      isUpdatingFromParentRef.current = true;
      api.gotoDate(selectedDate.toDate());
      setTimeout(() => {
        isUpdatingFromParentRef.current = false;
      }, 100);
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
          size="small"
          className="calendar-view__toggle"
        >
          <ToggleButton value="dayGridMonth">Month</ToggleButton>
          <ToggleButton value="timeGridWeek">Week</ToggleButton>
          <ToggleButton value="timeGridDay">Day</ToggleButton>
        </ToggleButtonGroup>
      </div>

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
      />
    </div>
  );
};

export default CalendarView;
