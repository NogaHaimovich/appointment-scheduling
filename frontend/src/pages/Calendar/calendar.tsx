import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import Button from "../../components/Button/Button";
import StyledDateCalendar from "../../components/StyledDateCalendar/StyledDateCalendar";
import CalendarView from "./components/CalendarView/CalendarView";
import { usePatientsContext } from "../../contexts/PatientsContext";
import type { Patient } from "../../types/types";
import "./styles.scss";
import FormControl from "@mui/material/FormControl";
import { Checkbox, FormControlLabel } from "@mui/material";

type PatientWithColor = Patient & { color: string };

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const { patients } = usePatientsContext();

  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

    useEffect(() => {
        if (patients.length > 0) {
            setSelectedPatients(patients.map((p) => p.id));
        }
    }, [patients]);

  const colors = ["red", "blue", "green", "orange", "purple"];

  const patientsWithColors = useMemo<PatientWithColor[]>(() => {
    return patients.map((patient, index) => ({
      ...patient,
      color: colors[index % colors.length],
    }));
  }, [patients]);


  const handlePatientToggle = (patientId: string) => {
    setSelectedPatients((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };


  const visiblePatients = useMemo<PatientWithColor[]>(() => {
    return patientsWithColors.filter((patient) =>
      selectedPatients.includes(patient.id)
    );
  }, [patientsWithColors, selectedPatients]);


  return (
    <div className="calendarPage">
      <div className="calendarPage__container">
        <div className="calendarPage__left">
          <Button
            className="calendarPage__button"
            onClick={() => navigate("/booking")}
          >
            + Schedule New appointment
          </Button>

          <h3>JUMP TO DATE</h3>
          <StyledDateCalendar
            value={selectedDate}
            onChange={setSelectedDate}
          />

          <h3>PATIENTS</h3>
          <FormControl>
            {patientsWithColors.map((patient) => (
              <FormControlLabel
                key={patient.id}
                control={
                  <Checkbox
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => handlePatientToggle(patient.id)}
                  />
                }
                label={
                  <span className="patientLabel">
                    <span
                      className={`patientLabel__color patientLabel__color--${patient.color}`}
                    />
                    <span className="patientLabel__name">
                      {patient.patient_name}
                    </span>
                  </span>
                }
              />
            ))}
          </FormControl>
        </div>

        <div className="calendarPage__right">
          <CalendarView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            patientsWithColors={visiblePatients}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
