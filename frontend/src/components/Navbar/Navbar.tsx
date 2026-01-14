import { useNavigate, useLocation } from "react-router-dom";
import { authUtils } from "../../utils/auth";
import "./styles.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authUtils.clearToken();
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/familyManagement") {
      return location.pathname === "/familyManagement";
    }
    if (path === "/booking") {
      return location.pathname === "/booking";
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo" onClick={()=>navigate("/dashboard")}>
          <div className="navbar__logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect className="navbar__logo-rect" width="24" height="24" rx="4"/>
              <path className="navbar__logo-plus" d="M12 7V17M7 12H17"/>
            </svg>
          </div>
          <span className="navbar__logo-text">HealthConnect</span>
        </div>
        
        <div className="navbar__links">
          <button
            className={`navbar__link ${isActive("/calendar") ? "active" : ""}`}
            onClick={() => navigate("/calendar")}
          >
            Calendar
          </button>
          <button
            className={`navbar__link ${isActive("/booking") ? "active" : ""}`}
            onClick={() => navigate("/booking")}
          >
            Book New Appoitment
          </button>
          <button
            className={`navbar__link ${isActive("/familyManagement") ? "active" : ""}`}
            onClick={() => navigate("/familyManagement")}
          >
            Patients
          </button>
          <button className="navbar__link navbar__link--logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

