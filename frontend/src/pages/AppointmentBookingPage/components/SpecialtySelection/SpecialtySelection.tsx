import type { FC } from "react";
import type { Specialty } from "../../../../types/types";
import "./styles.scss";

type SpecialtySelectorProps = {
  selectedSpecialty: string;
  specialties: Specialty[];
  onChange: (specialty: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const SpecialtySelector: FC<SpecialtySelectorProps> = ({ selectedSpecialty, specialties, onChange, loading, disabled }) => {
  return (
    <div className="specialty-selection">
      <h3 className="specialty-selection-title">2. SPECIALTY</h3>
      {loading ? (
        <div className="specialty-selection-loading">Loading specialties...</div>
      ) : (
        <div className="specialty-selection-list">
          {specialties.map((specialty) => {
            const isSelected = selectedSpecialty === specialty.name;
            return (
              <div
                key={specialty.id}
                className={`specialty-item ${isSelected ? 'selected' : ''}`}
                onClick={() => !disabled && !loading && onChange(specialty.name)}
              >
                <div className="specialty-content">
                  <span className="specialty-name">{specialty.name}</span>
                  {specialty.description && (
                    <span className="specialty-description">{specialty.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SpecialtySelector;
