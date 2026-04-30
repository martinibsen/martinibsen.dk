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
import { ConflictError, fetchBoard, saveBoard } from "./kanban-api";
import { renderCalendar } from "./kanban-calendar";
import { CardModal, type CardFormResult } from "./kanban-modal";
import { renderBoard } from "./kanban-render";

let board: Board = emptyBoard();
let loaded = false; // true once the first GET succeeds
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
      if (!loaded) return;
      const col = btn.dataset.add as ColumnId | undefined;
      if (col) modal?.openCreate(col);
    });
  }

  document.addEventListener("click", (e) => {
    if (!loaded) return;
    const target = e.target as HTMLElement | null;
    const card = target?.closest<HTMLElement>(".kb-card");
    if (!card?.dataset.id) return;
    const found = board.cards.find((c) => c.id === card.dataset.id);
    if (found) modal?.openEdit(found);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !loaded) return;
    const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(
      ".kb-card",
    );
    if (!card?.dataset.id) return;
    const found = board.cards.find((c) => c.id === card.dataset.id);
    if (found) modal?.openEdit(found);
  });

  setupDnd();
  await load();

  document.getElementById("kb-retry")?.addEventListener("click", () => {
    void load();
  });
}

async function load(): Promise<void> {
  setLoadError(false);
  setStatus("Henter…");
  setUiEnabled(false);
  try {
    board = await fetchBoard();
    loaded = true;
    redraw();
    setStatus("");
    setUiEnabled(true);
  } catch (err) {
    loaded = false;
    setStatus("");
    setLoadError(true);
    console.error("[kanban] load failed", err);
  }
}

function redraw(): void {
  renderBoard(board);
  const cal = document.getElementById("kb-cal");
  if (cal) renderCalendar(board, cal);
}

async function persist(next: Board): Promise<void> {
  if (!loaded) {
    toast("Kan ikke gemme — boardet er ikke indlæst.");
    return;
  }
  const previous = board;
  const expectedUpdatedAt = previous.updatedAt;
  board = next;
  redraw();
  setStatus("Gemmer…");
  try {
    board = await saveBoard(next, expectedUpdatedAt);
    redraw();
    setStatus("Gemt", 1500);
  } catch (err) {
    if (err instanceof ConflictError) {
      board = err.currentBoard;
      redraw();
      toast(
        "Konflikt — boardet blev opdateret af en anden. Din ændring blev ikke gemt.",
      );
      setStatus("");
      return;
    }
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
        position: movingColumn
          ? nextPosition(board.cards, data.column)
          : c.position,
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
        disabled: true, // enabled after first successful load
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

function setUiEnabled(enabled: boolean): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-add]")
    .forEach((btn) => {
      btn.disabled = !enabled;
    });
  for (const s of sortables) s.option("disabled", !enabled);
}

function setLoadError(visible: boolean): void {
  const el = document.getElementById("kb-load-error");
  if (!el) return;
  el.hidden = !visible;
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
  }, 4500);
}
