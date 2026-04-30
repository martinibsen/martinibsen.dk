// Server-only storage layer for the Kanban board.
// Persists a single Board document in Netlify Blobs.
// All mutations go through readBoard() -> mutate -> writeBoard() so the
// data layer stays isolated from API and UI code.

import { getStore, type Store } from "@netlify/blobs";
import {
  COLUMN_IDS,
  emptyBoard,
  type Board,
  type Card,
  type ColumnId,
} from "./kanban-types";

const STORE_NAME = "stilnote-kanban";
const BOARD_KEY = "board";

function store(): Store {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function readBoard(): Promise<Board> {
  const raw = await readRawBoard();
  return raw ?? emptyBoard();
}

/**
 * Returns the persisted board, or null if no board has been written yet.
 * Used by the PUT handler to distinguish "fresh install" from "version mismatch".
 */
export async function readRawBoard(): Promise<Board | null> {
  const raw = await store().get(BOARD_KEY, { type: "json" });
  if (!raw || typeof raw !== "object") return null;
  const board = raw as Board;
  if (!Array.isArray(board.cards)) return null;
  return board;
}

export async function writeBoard(board: Board): Promise<Board> {
  const next: Board = { ...board, updatedAt: new Date().toISOString() };
  await store().setJSON(BOARD_KEY, next);
  return next;
}

// ---- Pure helpers (no I/O) so they're easy to test and reason about ----

function nextPosition(cards: Card[], column: ColumnId): number {
  const inCol = cards.filter((c) => c.column === column);
  if (inCol.length === 0) return 0;
  return Math.max(...inCol.map((c) => c.position)) + 1;
}

function renumberColumn(cards: Card[], column: ColumnId): Card[] {
  const inCol = cards
    .filter((c) => c.column === column)
    .sort((a, b) => a.position - b.position);
  const others = cards.filter((c) => c.column !== column);
  const renumbered = inCol.map((c, i) => ({ ...c, position: i }));
  return [...others, ...renumbered];
}

export function sanitizeBoard(board: Board): Board {
  let cards = [...board.cards];
  for (const col of COLUMN_IDS) cards = renumberColumn(cards, col);
  return { ...board, cards };
}

export interface NewCardInput {
  title: string;
  description?: string;
  assignee?: Card["assignee"];
  column: ColumnId;
  dueDate?: string | null;
}

export function buildNewCard(
  cards: Card[],
  input: NewCardInput,
  now: Date = new Date(),
): Card {
  const ts = now.toISOString();
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: (input.description ?? "").trim(),
    assignee: input.assignee ?? null,
    column: input.column,
    dueDate: input.dueDate ?? null,
    position: nextPosition(cards, input.column),
    createdAt: ts,
    updatedAt: ts,
  };
}
