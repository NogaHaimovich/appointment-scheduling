import { Routes, Route } from "react-router-dom";
import AppointmentBookingPage from "../../pages/AppointmentBookingPage/AppointmentBookingPage";
import DashboardPage from "../../pages/DashboardPage/DashboardPage";
import FamilyManagementPage from "../../pages/FamilyManagementPage/FamilyManagementPage";
import { PatientsProvider } from "../../contexts/PatientsContext";
import { AppointmentsProvider } from "../../contexts/AppointmentsContext";
import CalendarPage from "../../pages/Calendar/calendar";

function ProtectedRoutesWrapper() {
  return (
    <PatientsProvider>
      <AppointmentsProvider>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/booking" element={<AppointmentBookingPage />} />
          <Route path="/familyManagement" element={<FamilyManagementPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </AppointmentsProvider>
    </PatientsProvider>
  );
}

export default ProtectedRoutesWrapper;

