import React from "react";
import type { Specialty } from "../../../types/types";
import "./style.scss"; 

type SpecialtyCardProps = {
  specialty: Specialty;
  imageSrc: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, imageSrc }) => {
  return (
    <div className="specialty-card">
      <div className="specialty-card__content">
        <h3 className="specialty-card__title">{specialty.name}</h3>
        {specialty.description && (
          <p className="specialty-card__description">{specialty.description}</p>
        )}
      </div>
      <img
        src={imageSrc}
        alt={specialty.name}
        className="specialty-card__image"
      />
    </div>
  );
};

export default SpecialtyCard;
