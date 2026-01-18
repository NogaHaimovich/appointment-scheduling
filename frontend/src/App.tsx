import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoutesWrapper from "./routes/protectedRoutes/ProtectedRoutesWrapper";
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
          <Route path="/*" element={<ProtectedRoutesWrapper />} />
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
