// Renders the Kanban board state into the static column shells.
// Idempotent — safe to call after every state change.

import {
  ASSIGNEE_LABELS,
  COLUMN_IDS,
  type Board,
  type Card,
  type ColumnId,
} from "../lib/kanban-types";

const DATE_FMT = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "short",
});

export function renderBoard(board: Board, root: ParentNode = document): void {
  for (const col of COLUMN_IDS) {
    const list = root.querySelector<HTMLElement>(`[data-list="${col}"]`);
    if (!list) continue;
    const cards = board.cards
      .filter((c) => c.column === col)
      .sort((a, b) => a.position - b.position);
    list.replaceChildren(...cards.map((c) => renderCard(c)));
    if (cards.length === 0) list.appendChild(renderEmpty());
  }
}

function renderCard(card: Card): HTMLElement {
  const el = document.createElement("article");
  el.className = "kb-card";
  el.dataset.id = card.id;
  el.tabIndex = 0;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", `Redigér kort: ${card.title}`);

  const title = document.createElement("h3");
  title.className = "kb-card-title";
  title.textContent = card.title;
  el.appendChild(title);

  if (card.description.trim().length > 0) {
    const desc = document.createElement("p");
    desc.className = "kb-card-desc";
    desc.textContent = card.description;
    el.appendChild(desc);
  }

  const meta = renderMeta(card);
  if (meta) el.appendChild(meta);

  return el;
}

function renderMeta(card: Card): HTMLElement | null {
  const bits: HTMLElement[] = [];

  if (card.assignee) {
    const tag = document.createElement("span");
    tag.className = "kb-tag kb-tag-assignee";
    tag.dataset.assignee = card.assignee;
    tag.textContent = ASSIGNEE_LABELS[card.assignee];
    bits.push(tag);
  }

  if (card.dueDate) {
    const tag = document.createElement("span");
    tag.className = "kb-tag kb-tag-date";
    if (isOverdue(card)) tag.classList.add("is-overdue");
    const d = new Date(`${card.dueDate}T00:00:00`);
    tag.textContent = DATE_FMT.format(d);
    bits.push(tag);
  }

  if (bits.length === 0) return null;
  const meta = document.createElement("div");
  meta.className = "kb-card-meta";
  meta.append(...bits);
  return meta;
}

function isOverdue(card: Card): boolean {
  if (!card.dueDate || card.column === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${card.dueDate}T00:00:00`);
  return due.getTime() < today.getTime();
}

function renderEmpty(): HTMLElement {
  const el = document.createElement("div");
  el.className = "kb-empty";
  el.textContent = "Tom kolonne";
  return el;
}

export function getCardElements(
  root: ParentNode,
  column: ColumnId,
): HTMLElement[] {
  const list = root.querySelector<HTMLElement>(`[data-list="${column}"]`);
  if (!list) return [];
  return Array.from(list.querySelectorAll<HTMLElement>(".kb-card"));
}
