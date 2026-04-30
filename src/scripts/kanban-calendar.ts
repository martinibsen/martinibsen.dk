// View-only year-overview calendar that lives under the Kanban board.
// Renders six months starting from the current month, with Danish weekday
// letters (M/T/O/T/F/L/S), week numbers on Mondays, Danish holidays, and
// markers for cards with a due date.

import type { Board, Card } from "../lib/kanban-types";

const DK_WEEKDAY = ["S", "M", "T", "O", "T", "F", "L"]; // Sun..Sat
const DK_MONTHS = [
  "Januar",
  "Februar",
  "Marts",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "December",
];

const ASSIGNEE_INITIAL = { martin: "M", sophia: "S" } as const;

const MONTHS_TO_SHOW = 6;

const holidaysByYear = new Map<number, Map<string, string>>();

export function renderCalendar(
  board: Board,
  host: HTMLElement,
  today: Date = new Date(),
): void {
  host.replaceChildren();
  const dueByDate = indexCardsByDate(board.cards);
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const todayKey = isoDate(today);

  for (let m = 0; m < MONTHS_TO_SHOW; m++) {
    const monthDate = new Date(start.getFullYear(), start.getMonth() + m, 1);
    host.appendChild(renderMonth(monthDate, dueByDate, todayKey));
  }
}

function indexCardsByDate(cards: Card[]): Map<string, Card[]> {
  const map = new Map<string, Card[]>();
  for (const c of cards) {
    if (!c.dueDate) continue;
    const list = map.get(c.dueDate) ?? [];
    list.push(c);
    map.set(c.dueDate, list);
  }
  return map;
}

function renderMonth(
  monthDate: Date,
  dueByDate: Map<string, Card[]>,
  todayKey: string,
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "kb-cal-month";

  const head = document.createElement("h3");
  head.className = "kb-cal-mhead";
  head.textContent = `${DK_MONTHS[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  wrap.appendChild(head);

  const lastDay = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
  const holidays = getHolidays(monthDate.getFullYear());

  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
    wrap.appendChild(renderDay(date, dueByDate, holidays, todayKey));
  }
  return wrap;
}

function renderDay(
  date: Date,
  dueByDate: Map<string, Card[]>,
  holidays: Map<string, string>,
  todayKey: string,
): HTMLElement {
  const row = document.createElement("div");
  row.className = "kb-cal-day";
  const dayOfWeek = date.getDay();
  const key = isoDate(date);
  if (dayOfWeek === 0 || dayOfWeek === 6) row.classList.add("is-weekend");
  if (key === todayKey) row.classList.add("is-today");

  const wd = document.createElement("span");
  wd.className = "kb-cal-wd";
  wd.textContent = DK_WEEKDAY[dayOfWeek];
  row.appendChild(wd);

  const num = document.createElement("span");
  num.className = "kb-cal-num";
  num.textContent = String(date.getDate());
  row.appendChild(num);

  const label = document.createElement("span");
  label.className = "kb-cal-label";
  const holiday = holidays.get(key);
  const deadlines = dueByDate.get(key) ?? [];
  const parts: string[] = [];
  if (holiday) parts.push(holiday);
  for (const card of deadlines) {
    const initial = card.assignee ? ASSIGNEE_INITIAL[card.assignee] : "·";
    parts.push(`${initial} ${card.title}`);
  }
  label.textContent = parts.join(" · ");
  if (deadlines.length > 0) row.classList.add("has-deadline");
  row.appendChild(label);

  if (dayOfWeek === 1) {
    const wk = document.createElement("span");
    wk.className = "kb-cal-week";
    wk.textContent = String(isoWeekNumber(date));
    row.appendChild(wk);
  } else {
    const spacer = document.createElement("span");
    spacer.className = "kb-cal-week is-empty";
    row.appendChild(spacer);
  }

  return row;
}

function getHolidays(year: number): Map<string, string> {
  let m = holidaysByYear.get(year);
  if (!m) {
    m = computeDanishHolidays(year);
    holidaysByYear.set(year, m);
  }
  return m;
}

function computeDanishHolidays(year: number): Map<string, string> {
  const m = new Map<string, string>();
  const easter = computeEaster(year);
  const add = (date: Date, name: string) => m.set(isoDate(date), name);
  add(new Date(year, 0, 1), "Nytårsdag");
  add(addDays(easter, -3), "Skærtorsdag");
  add(addDays(easter, -2), "Langfredag");
  add(easter, "Påskedag");
  add(addDays(easter, 1), "2. påskedag");
  add(addDays(easter, 39), "Kristi himmelfartsdag");
  add(addDays(easter, 49), "Pinsedag");
  add(addDays(easter, 50), "2. pinsedag");
  add(new Date(year, 4, 1), "Første maj");
  add(new Date(year, 5, 5), "Grundlovsdag");
  add(new Date(year, 11, 24), "Juleaftensdag");
  add(new Date(year, 11, 25), "1. juledag");
  add(new Date(year, 11, 26), "2. juledag");
  add(new Date(year, 11, 31), "Nytårsaftensdag");
  return m;
}

function computeEaster(year: number): Date {
  // Anonymous Gregorian algorithm.
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const mm = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * mm + 114) / 31);
  const day = ((h + l - 7 * mm + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isoWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}
