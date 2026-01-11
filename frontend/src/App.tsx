import AppointmentBookingPage from "./pages/AppointmentBookingPage/AppointmentBookingPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRoutes/protectedRoute";
import FamilyManagementPage from "./pages/FamilyManagementPage/FamilyManagementPage";
import Navbar from "./components/Navbar/Navbar";
import { authUtils } from "./utils/auth";

function AppContent() {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();
  const showNavbar = isAuthenticated && location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <AppointmentBookingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/familyManagement"
            element={
              <ProtectedRoute>
                <FamilyManagementPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
