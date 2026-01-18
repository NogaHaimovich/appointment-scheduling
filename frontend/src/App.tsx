import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoutesWrapper from "./routes/protectedRoutes/ProtectedRoutesWrapper";
import Navbar from "./components/Navbar/Navbar";
import { authUtils } from "./utils/auth";
import { Fab } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState } from "react";
import ChatBot from "./components/Chatbot/Chatbot";

function AppContent() {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();
  const showNavbar = isAuthenticated && location.pathname !== "/";

  const [isChatBotOpen, setIsChatBotOpen] = useState(false)

  return (
    <>
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoutesWrapper />} />
        </Routes>
         {isAuthenticated && location.pathname !== "/" && (
          <>
            <Fab
              color="primary"
              aria-label="chat"
              onClick={() => setIsChatBotOpen(true)}
              sx={{ position: "fixed", bottom: 20, right: 20 }}
            >
              <AutoAwesomeIcon />
            </Fab>
            <ChatBot isOpen={isChatBotOpen} onClose={()=> setIsChatBotOpen(false)} />
            </>
         )}
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
