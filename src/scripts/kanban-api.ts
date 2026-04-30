// Thin client-side wrapper for the Kanban API.
// Keeps fetch concerns out of the rendering / interaction code.

import type { Board } from "../lib/kanban-types";

interface ApiOk {
  ok: true;
  board: Board;
}

interface ApiErr {
  ok: false;
  error: string;
  board?: Board;
}

type ApiResponse = ApiOk | ApiErr;

/**
 * Thrown when the server rejects a save because someone else has updated
 * the board since this client last loaded it. Carries the current server
 * board so the caller can refresh state.
 */
export class ConflictError extends Error {
  constructor(public readonly currentBoard: Board) {
    super("Boardet er ændret af en anden — din ændring blev ikke gemt.");
    this.name = "ConflictError";
  }
}

export async function fetchBoard(): Promise<Board> {
  const res = await fetch("/api/kanban", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const data = await parse(res);
  if (!data.ok) throw new Error(data.error || "Ukendt fejl.");
  return data.board;
}

export async function saveBoard(
  board: Board,
  expectedUpdatedAt: string,
): Promise<Board> {
  const res = await fetch("/api/kanban", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board, expectedUpdatedAt }),
  });
  if (res.status === 409) {
    const data = (await res.json()) as ApiErr;
    if (data.board) throw new ConflictError(data.board);
    throw new Error("Boardet er ændret af en anden.");
  }
  const data = await parse(res);
  if (!data.ok) throw new Error(data.error || "Ukendt fejl.");
  return data.board;
}

async function parse(res: Response): Promise<ApiResponse> {
  try {
    return (await res.json()) as ApiResponse;
  } catch {
    throw new Error(`Serveren svarede ikke som forventet (${res.status}).`);
  }
}
