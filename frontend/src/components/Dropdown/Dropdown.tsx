import { Select, MenuItem, InputLabel, FormControl, ListItemText } from "@mui/material";
import type { DropdownOption } from "../../types/types";

type DropdownProps = {
  label: string;
  value: string;
  options: string[] | DropdownOption[];
  onChange: (value: string) => void;
  disable?: boolean;
}

const Dropdown = ({ label, value, options, onChange, disable }: DropdownProps) => {
  const labelId = `${label}-label`;
  
  const getOptionValue = (option: string | DropdownOption): string => {
    return typeof option === 'string' ? option : option.value;
  };
  
  const getOptionLabel = (option: string | DropdownOption): string => {
    return typeof option === 'string' ? option : option.label;
  };
  
  const getOptionDescription = (option: string | DropdownOption): string | undefined => {
    return typeof option === 'object' && 'description' in option ? option.description : undefined;
  };

  return (
    <FormControl fullWidth disabled={disable}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => {
          const option = options.find(opt => getOptionValue(opt) === selected);
          return option ? getOptionLabel(option) : selected;
        }}
      >
        {options.map((option, index) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          const description = getOptionDescription(option);
          
          return (
            <MenuItem key={`${optionValue}-${index}`} value={optionValue}>
              {description ? (
                <ListItemText 
                  primary={optionLabel} 
                  secondary={description}
                />
              ) : (
                optionLabel
              )}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
