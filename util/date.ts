export function dateDiffInDays(date1: Date, date2: Date) {
  // Set dates to UTC midnight to normalize them
  const dt1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const dt2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  // Milliseconds in a day
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds and convert to days
  return Math.floor(Math.abs(dt2 - dt1) / MS_PER_DAY);
}
