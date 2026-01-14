import { type Dayjs } from "dayjs";
import type { FC } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "./styles.scss";

type StyledDateCalendarProps = {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  shouldDisableDate?: (date: Dayjs) => boolean;
  disabled?: boolean;
  className?: string;
};

const StyledDateCalendar: FC<StyledDateCalendarProps> = ({
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={onChange}
        className={`styled-date-calendar ${className}`}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default StyledDateCalendar;

