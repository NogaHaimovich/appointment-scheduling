import AppointmentBookingPage from "./pages/AppointmentBookingPage/AppointmentBookingPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import LoginPage from "./pages/LoginPage/LoginPage";
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
