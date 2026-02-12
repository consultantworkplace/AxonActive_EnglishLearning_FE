function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toYmd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function addDaysYmd(ymd: string, days: number) {
  const [y, m, dd] = ymd.split("-").map((x) => Number(x));
  const date = new Date(y, m - 1, dd);
  date.setDate(date.getDate() + days);
  return toYmd(date);
}

export function todayYmd() {
  return toYmd(new Date());
}

// Monday as week start.
export function weekStartMondayYmd(fromYmd: string) {
  const [y, m, dd] = fromYmd.split("-").map((x) => Number(x));
  const date = new Date(y, m - 1, dd);
  const day = date.getDay(); // Sun 0 ... Sat 6
  const diffToMonday = (day + 6) % 7;
  date.setDate(date.getDate() - diffToMonday);
  return toYmd(date);
}

export function lastNDaysYmd(n: number, endYmd = todayYmd()) {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) days.push(addDaysYmd(endYmd, -i));
  return days;
}

