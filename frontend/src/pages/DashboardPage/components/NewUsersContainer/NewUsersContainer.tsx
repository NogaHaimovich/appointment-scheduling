import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import type { SpecialitiesResponse } from "../../../../types/types";

import cardiologyImage from "../../../../images/cardiology.png";
import dermatologyImage from "../../../../images/dermatology.png";
import neurologyImage from "../../../../images/neurology.png";
import orthopedicsImage from "../../../../images/orthopedics.png";
import pediatricsImage from "../../../../images/pediatrics.png";

import SpecialtyCard from "../SpecialtyCard/SpecialtyCard";
import "./styles.scss";

const getSpecialtyImage = (specialtyName: string): string => {
  const imageMap: Record<string, string> = {
    "Cardiology": cardiologyImage,
    "Dermatology": dermatologyImage,
    "Neurology": neurologyImage,
    "Orthopedics": orthopedicsImage,
    "Pediatrics": pediatricsImage,
  };

  return imageMap[specialtyName] || "";
};

type NewUserContainerProps = {
  specialties: SpecialitiesResponse | null;
  accountName: string | null;
};

const NewUserContainer = ({ specialties, accountName }: NewUserContainerProps) => {
  const navigate = useNavigate();
  const handleScheduleClick = () => {
    navigate("/booking");
  };

  const welcomeText = accountName ? `Welcome, ${accountName}!` : "Welcome!";

  return (
    <div className="dashboardPage__new-account">
      <h1>{welcomeText}</h1>
      <h2>You don't have any appointment yet – schedule your first one!</h2>
      <div className="dashboardPage__button-container">
        <Button className="dashboardPage__button" onClick={handleScheduleClick}>
          Schedule appointment
        </Button>
      </div>
      <h2>Our specialties:</h2>
      {specialties && specialties.specialties ? (
        <div className="specialties-cards">
          {specialties.specialties.map((s) => (
            <SpecialtyCard
              key={s.id}
              specialty={s}
              imageSrc={getSpecialtyImage(s.name)}
            />
          ))}
        </div>
      ) : null}
      <div className="dashboardPage__family-button-container">
        <Button className="dashboardPage__button dashboardPage__button--secondary" onClick={() => navigate("/familyManagement")}>
          Manage Family Members
        </Button>
      </div>
    </div>
  );
};

export default NewUserContainer;
