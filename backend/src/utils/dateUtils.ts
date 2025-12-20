
export function getCurrentDateTime(): { today: string; currentTime: string } {
  const now = new Date();
  
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  
  return { today, currentTime };
}


export function convertLocalDateToUTC(dateString: string): string {
  if (!dateString) return dateString;
  
  const parts = dateString.split('-');
  if (parts.length >= 3) {
    const yearStr = parts[0];
    const monthStr = parts[1];
    const dayStr = parts[2];
    
    if (yearStr && monthStr && dayStr) {
      const year = Number(yearStr);
      const month = Number(monthStr);
      const day = Number(dayStr);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const localDate = new Date(year, month - 1, day);
        const utcYear = localDate.getUTCFullYear();
        const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
        const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
        return `${utcYear}-${utcMonth}-${utcDay}`;
      }
    }
  }
  
  return dateString;
}

export function formatDateToUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

