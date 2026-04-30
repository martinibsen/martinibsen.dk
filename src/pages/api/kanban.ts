// Kanban API — single endpoint backing the /stilnote board.
// GET  /api/kanban  -> { ok: true, board }
// PUT  /api/kanban  -> { ok: true, board }   (body: { board })
//
// The board is a single Netlify Blobs document. Last-write-wins is acceptable
// here because there are exactly two users (Martin + Sophia) and edits are
// effectively never simultaneous.

import type { APIRoute } from "astro";
import { readBoard, sanitizeBoard, writeBoard } from "../../lib/kanban-storage";
import {
  COLUMN_IDS,
  type Assignee,
  type Board,
  type Card,
  type ColumnId,
} from "../../lib/kanban-types";

export const prerender = false;

const json = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

export const GET: APIRoute = async () => {
  try {
    const board = await readBoard();
    return json(200, { ok: true, board });
  } catch (err) {
    console.error("[kanban] GET failed", err);
    return json(500, { ok: false, error: "Kunne ikke hente boardet." });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return json(400, { ok: false, error: "Ugyldig JSON i request." });
  }

  const incoming = (parsed as { board?: unknown })?.board;
  const validated = validateBoard(incoming);
  if (!validated) {
    return json(400, { ok: false, error: "Boardet har ugyldigt format." });
  }

  try {
    const saved = await writeBoard(sanitizeBoard(validated));
    return json(200, { ok: true, board: saved });
  } catch (err) {
    console.error("[kanban] PUT failed", err);
    return json(500, { ok: false, error: "Kunne ikke gemme boardet." });
  }
};

// ---- Validation ----

const VALID_ASSIGNEES: Assignee[] = ["martin", "sophia"];

function validateBoard(input: unknown): Board | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;
  if (!Array.isArray(obj.cards)) return null;
  const cards: Card[] = [];
  for (const raw of obj.cards) {
    const card = validateCard(raw);
    if (!card) return null;
    cards.push(card);
  }
  return {
    cards,
    updatedAt:
      typeof obj.updatedAt === "string"
        ? obj.updatedAt
        : new Date().toISOString(),
  };
}

function validateCard(raw: unknown): Card | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.title !== "string" || r.title.trim().length === 0) return null;
  if (!isColumn(r.column)) return null;
  if (typeof r.position !== "number" || !Number.isFinite(r.position))
    return null;
  const assignee =
    r.assignee === null || r.assignee === undefined
      ? null
      : VALID_ASSIGNEES.includes(r.assignee as Assignee)
        ? (r.assignee as Assignee)
        : null;
  return {
    id: r.id,
    title: r.title.trim().slice(0, 200),
    description:
      typeof r.description === "string" ? r.description.slice(0, 5000) : "",
    assignee,
    column: r.column,
    dueDate:
      typeof r.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.dueDate)
        ? r.dueDate
        : null,
    position: r.position,
    createdAt:
      typeof r.createdAt === "string"
        ? r.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof r.updatedAt === "string"
        ? r.updatedAt
        : new Date().toISOString(),
  };
}

function isColumn(v: unknown): v is ColumnId {
  return typeof v === "string" && (COLUMN_IDS as string[]).includes(v);
}
