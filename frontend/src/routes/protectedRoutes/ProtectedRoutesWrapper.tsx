import { Routes, Route } from "react-router-dom";
import AppointmentBookingPage from "../../pages/AppointmentBookingPage/AppointmentBookingPage";
import DashboardPage from "../../pages/DashboardPage/DashboardPage";
import FamilyManagementPage from "../../pages/FamilyManagementPage/FamilyManagementPage";
import { PatientsProvider } from "../../contexts/PatientsContext";

function ProtectedRoutesWrapper() {
  return (
    <PatientsProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking" element={<AppointmentBookingPage />} />
        <Route path="/familyManagement" element={<FamilyManagementPage />} />
      </Routes>
    </PatientsProvider>
  );
}

export default ProtectedRoutesWrapper;

