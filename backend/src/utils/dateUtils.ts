
export function getCurrentDateTime(): { today: string; currentTime: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  const currentTime = now.toTimeString().slice(0, 5);
  
  return { today, currentTime };
}

