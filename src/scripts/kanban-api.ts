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
}

type ApiResponse = ApiOk | ApiErr;

async function call(method: "GET" | "PUT", body?: unknown): Promise<Board> {
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch("/api/kanban", init);
  let data: ApiResponse;
  try {
    data = (await res.json()) as ApiResponse;
  } catch {
    throw new Error(`Serveren svarede ikke som forventet (${res.status}).`);
  }
  if (!data.ok) throw new Error(data.error || "Ukendt fejl.");
  return data.board;
}

export function fetchBoard(): Promise<Board> {
  return call("GET");
}

export function saveBoard(board: Board): Promise<Board> {
  return call("PUT", { board });
}
