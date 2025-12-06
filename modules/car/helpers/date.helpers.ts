// Αν δουλεύεις με "YYYY-MM-DD" από frontend / Postman

// Συνδυάζει date + time σε JS Date (θεωρούμε local input, αλλά αυτό μας νοιάζει μόνο για διαφορά & overlap)
export function mergeDateAndTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

// Επιστρέφει όλες τις μέρες που περνάει η κράτηση (τύπου 06,07,08,09)
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];

  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  while (cur < end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return dates;
}

// Πόσες μέρες κράτησης (σε full days)
export function diffInDays(start: Date, end: Date): number {
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diff = Math.round((e.getTime() - s.getTime()) / 86400000);
  return diff > 0 ? diff : 1;
}
