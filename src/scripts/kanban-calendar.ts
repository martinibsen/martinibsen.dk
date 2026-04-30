// View-only year-overview calendar that lives under the Kanban board.
// Renders six months starting from the current month, with Danish weekday
// letters (M/T/O/T/F/L/S), week numbers on Mondays, Danish holidays, and
// markers for cards with a due date.

import {
  ASSIGNEE_LABELS,
  COLUMN_LABELS,
  type Board,
  type Card,
} from "../lib/kanban-types";

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

// Module-level state so the hover handlers (bound once) can read fresh data
// after every redraw without rebinding listeners.
let currentDueByDate: Map<string, Card[]> = new Map();
let popoverEl: HTMLElement | null = null;
let hoverHandlersBound = false;

export function renderCalendar(
  board: Board,
  host: HTMLElement,
  today: Date = new Date(),
): void {
  host.replaceChildren();
  currentDueByDate = indexCardsByDate(board.cards);
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const todayKey = isoDate(today);

  for (let m = 0; m < MONTHS_TO_SHOW; m++) {
    const monthDate = new Date(start.getFullYear(), start.getMonth() + m, 1);
    host.appendChild(renderMonth(monthDate, currentDueByDate, todayKey));
  }

  if (!hoverHandlersBound) {
    bindHoverHandlers(host);
    hoverHandlersBound = true;
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
  row.dataset.date = key;
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

  if (holiday) {
    const h = document.createElement("span");
    h.className = "kb-cal-holiday";
    h.textContent = holiday;
    label.appendChild(h);
  }
  if (holiday && deadlines.length > 0) {
    label.appendChild(document.createTextNode(" · "));
  }
  if (deadlines.length > 0) {
    const d = document.createElement("span");
    d.className = "kb-cal-deadline";
    d.textContent = deadlines
      .map(
        (c) =>
          `${c.assignee ? ASSIGNEE_INITIAL[c.assignee] : "·"} ${c.title}`,
      )
      .join(" · ");
    label.appendChild(d);
    row.classList.add("has-deadline");
    row.tabIndex = 0; // keyboard focusable so screen-reader / kbd users get the popover too
  }
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

function bindHoverHandlers(host: HTMLElement): void {
  popoverEl = document.getElementById("kb-cal-popover");
  if (!popoverEl) return;

  const open = (target: HTMLElement) => {
    const row = target.closest<HTMLElement>(".kb-cal-day.has-deadline");
    if (!row) return;
    const key = row.dataset.date;
    if (!key) return;
    const cards = currentDueByDate.get(key);
    if (!cards || cards.length === 0) return;
    showPopover(row, cards);
  };

  const close = (e: Event) => {
    const next = (e as FocusEvent | MouseEvent).relatedTarget as Node | null;
    if (next && popoverEl?.contains(next)) return;
    hidePopover();
  };

  host.addEventListener("mouseover", (e) => open(e.target as HTMLElement));
  host.addEventListener("mouseout", close);
  host.addEventListener("focusin", (e) => open(e.target as HTMLElement));
  host.addEventListener("focusout", close);
  document.addEventListener("scroll", hidePopover, { passive: true });
  window.addEventListener("resize", hidePopover);
}

function showPopover(row: HTMLElement, cards: Card[]): void {
  if (!popoverEl) return;
  popoverEl.replaceChildren(...cards.map(renderPopCard));
  popoverEl.hidden = false;

  const rect = row.getBoundingClientRect();
  const pop = popoverEl.getBoundingClientRect();
  const margin = 8;

  let left = rect.right + margin;
  if (left + pop.width > window.innerWidth - margin) {
    left = rect.left - pop.width - margin;
  }
  if (left < margin) left = margin;

  let top = rect.top + rect.height / 2 - pop.height / 2;
  top = Math.max(
    margin,
    Math.min(top, window.innerHeight - pop.height - margin),
  );

  popoverEl.style.left = `${left}px`;
  popoverEl.style.top = `${top}px`;
}

function hidePopover(): void {
  if (popoverEl) popoverEl.hidden = true;
}

function renderPopCard(card: Card): HTMLElement {
  const el = document.createElement("div");
  el.className = "kb-cal-pop-card";

  const title = document.createElement("div");
  title.className = "kb-cal-pop-title";
  title.textContent = card.title;
  el.appendChild(title);

  const meta = document.createElement("div");
  meta.className = "kb-cal-pop-meta";
  const parts: string[] = [COLUMN_LABELS[card.column]];
  if (card.assignee) parts.push(ASSIGNEE_LABELS[card.assignee]);
  meta.textContent = parts.join(" · ");
  el.appendChild(meta);

  if (card.description.trim().length > 0) {
    const desc = document.createElement("div");
    desc.className = "kb-cal-pop-desc";
    desc.textContent = card.description;
    el.appendChild(desc);
  }
  return el;
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
