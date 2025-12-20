import type { FC } from "react";
import Dropdown from "../../../../components/Dropdown/Dropdown";

type DoctorSelectorProps = {
  selectedDoctor: string;
  options: string[];
  onChange: (doctor: string) => void;
  loading: boolean;
  disabled: boolean;
}

const DoctorSelector: FC<DoctorSelectorProps> = ({ selectedDoctor, options, onChange, loading, disabled }) => (
  <div className="dropdown-container">
    <h3 className="dropdown-title">Select Doctor</h3>
    <Dropdown
      label="Doctor"
      value={selectedDoctor}
      options={options}
      onChange={onChange}
      disable={disabled || loading}
    />
  </div>
);

export default DoctorSelector;
