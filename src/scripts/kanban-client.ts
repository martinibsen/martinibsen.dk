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

type Mutation = (current: Board) => Board;

const MAX_CONFLICT_RETRIES = 3;

/**
 * Apply a mutation to the board and persist it. On a 409 conflict, replay
 * the mutation on top of the server's current state and try again — that's
 * what prevents a fresh card (or a drag) from disappearing when someone
 * else has touched the board between our last load and this save.
 */
async function persist(mutate: Mutation): Promise<void> {
  if (!loaded) {
    toast("Kan ikke gemme — boardet er ikke indlæst.");
    return;
  }
  const previous = board;
  let next = mutate(previous);
  board = next;
  redraw();
  setStatus("Gemmer…");

  for (let attempt = 0; attempt <= MAX_CONFLICT_RETRIES; attempt++) {
    try {
      board = await saveBoard(next, next.updatedAt);
      redraw();
      setStatus("Gemt", 1500);
      return;
    } catch (err) {
      if (err instanceof ConflictError) {
        if (attempt === MAX_CONFLICT_RETRIES) {
          board = err.currentBoard;
          redraw();
          toast(
            "Boardet ændres for hurtigt af andre — kunne ikke gemme. Prøv igen.",
          );
          setStatus("");
          return;
        }
        next = mutate(err.currentBoard);
        board = next;
        redraw();
        setStatus("Synkroniserer…");
        continue;
      }
      board = previous;
      redraw();
      toast(err instanceof Error ? err.message : "Kunne ikke gemme.");
      setStatus("");
      return;
    }
  }
}

async function handleSubmit(
  existingId: string | null,
  data: CardFormResult,
): Promise<void> {
  const now = new Date().toISOString();
  // Generate the id once so retries reuse it (idempotent on the server).
  const newId = existingId ?? crypto.randomUUID();

  await persist((current) => {
    let cards: Card[];
    if (existingId) {
      cards = current.cards.map((c) => {
        if (c.id !== existingId) return c;
        const movingColumn = c.column !== data.column;
        return {
          ...c,
          ...data,
          position: movingColumn
            ? nextPosition(current.cards, data.column)
            : c.position,
          updatedAt: now,
        };
      });
    } else {
      // If a previous attempt already landed (rare), don't duplicate.
      if (current.cards.some((c) => c.id === newId)) return current;
      const card: Card = {
        id: newId,
        ...data,
        position: nextPosition(current.cards, data.column),
        createdAt: now,
        updatedAt: now,
      };
      cards = [...current.cards, card];
    }
    return { ...current, cards };
  });
}

async function handleDelete(id: string): Promise<void> {
  await persist((current) => ({
    ...current,
    cards: current.cards.filter((c) => c.id !== id),
  }));
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
  // Capture only the moves that the DOM tells us about. Cards we don't know
  // about (e.g. added by another tab between load and now) are left alone
  // when we rebase on the server's state.
  const moves = new Map<string, { column: ColumnId; position: number }>();
  for (const col of COLUMN_IDS) {
    const list = document.querySelector<HTMLElement>(`[data-list="${col}"]`);
    if (!list) continue;
    const elements = list.querySelectorAll<HTMLElement>(".kb-card");
    elements.forEach((el, index) => {
      const id = el.dataset.id;
      if (id) moves.set(id, { column: col, position: index });
    });
  }
  const now = new Date().toISOString();
  await persist((current) => {
    const cards = current.cards.map((c) => {
      const m = moves.get(c.id);
      if (!m) return c;
      if (c.column === m.column && c.position === m.position) return c;
      return { ...c, column: m.column, position: m.position, updatedAt: now };
    });
    return { ...current, cards };
  });
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
