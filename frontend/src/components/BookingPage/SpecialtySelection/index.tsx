import type { FC } from "react";
import Dropdown from "../../common/Dropdown";
import type { DropdownOption } from "../../../types/types";

type SpecialtySelectorProps = {
  selectedSpecialty: string;
  options: string[] | DropdownOption[];
  onChange: (specialty: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const SpecialtySelector: FC<SpecialtySelectorProps> = ({ selectedSpecialty, options, onChange, loading, disabled }) => (
  <div className="dropdown-container">
    <h3 className="dropdown-title">Select Specialty</h3>
    <Dropdown
      label="Specialty"
      value={selectedSpecialty}
      options={options}
      onChange={onChange}
      disable={disabled || loading}
    />
  </div>
);

export default SpecialtySelector;
