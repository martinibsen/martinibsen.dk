// Main client entry for /stilnote.
// Owns the in-memory board state, wires Sortable for drag-and-drop, and
// flushes mutations through the API. Other client modules stay UI-focused.

import Sortable from "sortablejs";
import {
  COLUMN_IDS,
  emptyBoard,
  type Board,
  type Card,
  type ColumnId,
} from "../lib/kanban-types";
import { fetchBoard, saveBoard } from "./kanban-api";
import { CardModal, type CardFormResult } from "./kanban-modal";
import { renderBoard } from "./kanban-render";

let board: Board = emptyBoard();
let modal: CardModal | null = null;
let toastTimer: number | null = null;
const sortables: Sortable[] = [];

export function initKanban(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}

async function boot(): Promise<void> {
  modal = new CardModal(document, {
    onSubmit: handleSubmit,
    onDelete: handleDelete,
  });

  for (const btn of document.querySelectorAll<HTMLButtonElement>(
    "[data-add]",
  )) {
    btn.addEventListener("click", () => {
      const col = btn.dataset.add as ColumnId | undefined;
      if (col) modal?.openCreate(col);
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const card = target?.closest<HTMLElement>(".kb-card");
    if (!card?.dataset.id) return;
    const found = board.cards.find((c) => c.id === card.dataset.id);
    if (found) modal?.openEdit(found);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(
      ".kb-card",
    );
    if (!card?.dataset.id) return;
    const found = board.cards.find((c) => c.id === card.dataset.id);
    if (found) modal?.openEdit(found);
  });

  await load();
  setupDnd();
}

async function load(): Promise<void> {
  setStatus("Henter…");
  try {
    board = await fetchBoard();
    redraw();
    setStatus("");
  } catch (err) {
    setStatus("Kunne ikke hente boardet.");
    console.error(err);
  }
}

function redraw(): void {
  renderBoard(board);
}

async function persist(next: Board, optimistic = true): Promise<void> {
  const previous = board;
  if (optimistic) {
    board = next;
    redraw();
  }
  setStatus("Gemmer…");
  try {
    board = await saveBoard(next);
    redraw();
    setStatus("Gemt", 1500);
  } catch (err) {
    board = previous;
    redraw();
    toast(err instanceof Error ? err.message : "Kunne ikke gemme.");
    setStatus("");
  }
}

async function handleSubmit(
  existingId: string | null,
  data: CardFormResult,
): Promise<void> {
  const now = new Date().toISOString();
  let cards: Card[];
  if (existingId) {
    cards = board.cards.map((c) => {
      if (c.id !== existingId) return c;
      const movingColumn = c.column !== data.column;
      return {
        ...c,
        ...data,
        position: movingColumn ? nextPosition(board.cards, data.column) : c.position,
        updatedAt: now,
      };
    });
  } else {
    const card: Card = {
      id: crypto.randomUUID(),
      ...data,
      position: nextPosition(board.cards, data.column),
      createdAt: now,
      updatedAt: now,
    };
    cards = [...board.cards, card];
  }
  await persist({ ...board, cards });
}

async function handleDelete(id: string): Promise<void> {
  const cards = board.cards.filter((c) => c.id !== id);
  await persist({ ...board, cards });
}

function setupDnd(): void {
  for (const list of document.querySelectorAll<HTMLElement>("[data-list]")) {
    sortables.push(
      Sortable.create(list, {
        group: "kanban",
        animation: 160,
        draggable: ".kb-card",
        filter: ".kb-empty",
        ghostClass: "kb-card-ghost",
        chosenClass: "kb-card-chosen",
        dragClass: "kb-card-drag",
        forceFallback: true,
        fallbackTolerance: 4,
        onEnd: (evt) => {
          if (evt.from === evt.to && evt.oldIndex === evt.newIndex) return;
          void applyDnd();
        },
      }),
    );
  }
}

async function applyDnd(): Promise<void> {
  const rebuilt: Card[] = [];
  for (const col of COLUMN_IDS) {
    const list = document.querySelector<HTMLElement>(`[data-list="${col}"]`);
    if (!list) continue;
    const elements = list.querySelectorAll<HTMLElement>(".kb-card");
    elements.forEach((el, index) => {
      const id = el.dataset.id;
      if (!id) return;
      const original = board.cards.find((c) => c.id === id);
      if (!original) return;
      rebuilt.push({
        ...original,
        column: col,
        position: index,
        updatedAt:
          original.column === col && original.position === index
            ? original.updatedAt
            : new Date().toISOString(),
      });
    });
  }
  await persist({ ...board, cards: rebuilt });
}

function nextPosition(cards: Card[], column: ColumnId): number {
  const inCol = cards.filter((c) => c.column === column);
  return inCol.length === 0
    ? 0
    : Math.max(...inCol.map((c) => c.position)) + 1;
}

function setStatus(text: string, autoClearMs = 0): void {
  const el = document.getElementById("kb-status");
  if (!el) return;
  el.textContent = text;
  if (autoClearMs > 0) {
    window.setTimeout(() => {
      if (el.textContent === text) el.textContent = "";
    }, autoClearMs);
  }
}

function toast(message: string): void {
  const el = document.getElementById("kb-toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.hidden = true;
  }, 3500);
}
