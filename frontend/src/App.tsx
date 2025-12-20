import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route key='login' path="/" element= {<LoginPage/>}/>,
          <Route key='dashboard' path="/dashboard" element= {<DashboardPage/>}/>
          <Route key="booking" path= "/booking" element= {<AppointmentBookingPage/>}/>
        </Routes>
      </main>
    </BrowserRouter>

  )
}

export default App
