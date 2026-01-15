
export const formatDateToDisplay = (dateString: string): string => {
  if (!dateString) return dateString;
  
  if (dateString.includes('-') && dateString.split('-')[0]?.length === 4) {
    const parts = dateString.split('-');
    if (parts.length >= 3) {
      const [year, month, day] = parts;
      if (year && month && day) {
        return `${day}.${month}.${year}`;
      }
    }
  }
  
  return dateString;
};

export const formatDateToAPI = (dateString: string): string => {
  if (!dateString) return dateString;
  
  if (dateString.includes('-') && dateString.split('-')[0]?.length === 4) {
    return dateString;
  }
  
  const parts = dateString.split('-');
  if (parts.length >= 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
  }
  
  return dateString;
};


export const convertLocalDateToUTC = (localDateString: string): string => {
  if (!localDateString) return localDateString;
  
  const parts = localDateString.split('-');
  if (parts.length >= 3) {
    const [year, month, day] = parts.map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const localDate = new Date(year, month - 1, day);
      const utcYear = localDate.getUTCFullYear();
      const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
      const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
      return `${utcYear}-${utcMonth}-${utcDay}`;
    }
  }
  
  return localDateString;
};

export const formatTimeToDisplay = (timeString: string, dateString: string): string => {
  if (!timeString || !dateString) return timeString;
  
  const dateParts = dateString.split('-');
  const timeParts = timeString.split(':');
  
  if (dateParts.length >= 3 && timeParts.length >= 2) {
    const [year, month, day] = dateParts.map(Number);
    const [hour, minute] = timeParts.map(Number);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour) && !isNaN(minute)) {
      const utcDateTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
      const localHours = String(utcDateTime.getHours()).padStart(2, '0');
      const localMinutes = String(utcDateTime.getMinutes()).padStart(2, '0');
      return `${localHours}:${localMinutes}`;
    }
  }
  
  return timeString;
};


export const formatTimeToAPI = (timeString: string, dateString: string): string => {
  if (!timeString || !dateString) return timeString;
  
  const dateParts = dateString.split('-');
  const timeParts = timeString.split(':');
  
  if (dateParts.length >= 3 && timeParts.length >= 2) {
    const [year, month, day] = dateParts.map(Number);
    const [hour, minute] = timeParts.map(Number);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour) && !isNaN(minute)) {
      const localDateTime = new Date(year, month - 1, day, hour, minute);
      const utcHours = String(localDateTime.getUTCHours()).padStart(2, '0');
      const utcMinutes = String(localDateTime.getUTCMinutes()).padStart(2, '0');
      return `${utcHours}:${utcMinutes}`;
    }
  }
  
  return timeString;
};


export const convertToGCalUTC = (
  dateStr: string,
  timeStr: string,
  durationMinutes = 60
) => {
  if (!dateStr || !timeStr) return null;

  const dateParts = dateStr.split("-");
  const timeParts = timeStr.split(":");
  
  if (dateParts.length >= 3 && timeParts.length >= 2) {
    const [year, month, day] = dateParts.map(Number);
    const [hour, minute] = timeParts.map(Number);
    
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hour) && !isNaN(minute)) {
      const startUTC = new Date(Date.UTC(year, month - 1, day, hour, minute));

      if (isNaN(startUTC.getTime())) {
        console.error("Invalid date/time:", dateStr, timeStr);
        return null;
      }

      const endUTC = new Date(startUTC.getTime() + durationMinutes * 60 * 1000);
      const formatForGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
      return { start: formatForGCal(startUTC), end: formatForGCal(endUTC) };
    }
  }
  
  return null;
};

export const formatAppointmentDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

