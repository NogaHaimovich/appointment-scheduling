import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import type { SpecialitiesResponse } from "../../../../types/types";
import { useData } from "../../../../hooks/useData";
import { API_ENDPOINTS } from "../../../../config/api";

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

const NewUserContainer = () => {
  const { data: specialties, loading: loadingSpecialties } =
    useData<SpecialitiesResponse>(API_ENDPOINTS.getSpecialties, 0);

  const navigate = useNavigate();
  const handleScheduleClick = () => {
    navigate("/booking");
  };

  return (
    <div className="dashboardPage__new-user">
      <h1>Welcome!</h1>
      <h2>You don't have any appointment yet – schedule your first one!</h2>
      <Button className="dashboardPage__button" onClick={handleScheduleClick}>
        Schedule appointment
      </Button>

      <h2>Our specialties:</h2>
      {loadingSpecialties ? (
        <p>Loading specialties...</p>
      ) : (
        <div className="specialties-cards">
          {specialties?.specialties.map((s) => (
            <SpecialtyCard
              key={s.id}
              specialty={s}
              imageSrc={getSpecialtyImage(s.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewUserContainer;
