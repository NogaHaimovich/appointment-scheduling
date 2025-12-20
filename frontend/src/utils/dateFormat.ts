export const formatDateToDisplay = (dateString: string): string => {
  if (!dateString) return dateString;
  
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  
  return dateString;
};


export const formatDateToAPI = (dateString: string): string => {
  if (!dateString) return dateString;
  
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    return dateString;
  }
  
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};



export const convertToGCalUTC = (
  dateStr: string,
  timeStr: string,
  durationMinutes = 60
) => {
  if (!dateStr || !timeStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const startLocal = new Date(year, month - 1, day, hour, minute);

  if (isNaN(startLocal.getTime())) {
    console.error("Invalid date/time:", dateStr, timeStr);
    return null;
  }

  const endLocal = new Date(startLocal.getTime() + durationMinutes * 60 * 1000);

  const formatForGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
  return { start: formatForGCal(startLocal), end: formatForGCal(endLocal) };
};

