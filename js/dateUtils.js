export function ymdFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayYmd() {
  return ymdFromDate(new Date());
}

export function parseYmd(ymd) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(ymd, days) {
  const date = parseYmd(ymd);
  date.setDate(date.getDate() + days);
  return ymdFromDate(date);
}

export function lastNDates(count, endYmd = todayYmd()) {
  const dates = [];
  for (let i = 0; i < count; i += 1) {
    dates.push(addDays(endYmd, -i));
  }
  return dates;
}

export function isWeekday(ymd) {
  const date = parseYmd(ymd);
  const day = date.getDay();
  return day >= 1 && day <= 5;
}
