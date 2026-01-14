import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import Button from "../../components/Button/Button";
import StyledDateCalendar from "../../components/StyledDateCalendar/StyledDateCalendar";
import CalendarView from "./components/CalendarView/CalendarView";
import { useData } from "../../hooks/useData";
import { API_ENDPOINTS } from "../../config/api";
import { authUtils } from "../../utils/auth";
import type { AppointmentsResponse } from "../../types/types";
import "./styles.scss";
import FormControl from "@mui/material/FormControl";
import { Checkbox, FormControlLabel } from "@mui/material";

const CalendarPage = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    
    const accountId = authUtils.getAccountIdFromToken();
    const requestBody = useMemo(() => ({ accountId }), [accountId]);
    const { data } = useData<AppointmentsResponse>(
        API_ENDPOINTS.getAccountAppointments,
        0,
        requestBody
    );

    const allAppointments = useMemo(() => {
        if (!data) return [];
        return [...(data.upcomingAppointment || []), ...(data.appointmentHistory || [])];
    }, [data]);

    return (
        <div className="calendarPage">
        <div className="calendarPage__container">
                <div className="calendarPage__left">
                    <Button className="calendarPage__button" onClick={() => navigate("/booking")}>
                         + Schedule New appointment
                    </Button>

                    <h3>JUMP TO DATE</h3>
                    <StyledDateCalendar
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />

                    <h3>PATIENTS</h3>
                   <FormControl>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label={
                            <span className="patientLabel">
                                <span className="patientLabel__color patientLabel__color--blue" />
                                <span className="patientLabel__name">Noga</span>
                            </span>
                            }
                        />

                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label={
                            <span className="patientLabel">
                                <span className="patientLabel__color patientLabel__color--green" />
                                <span className="patientLabel__name">David</span>
                            </span>
                            }
                        />
                    </FormControl>

                </div>

                <div className="calendarPage__right">
                    <CalendarView
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        appointments={allAppointments}
                    />
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
