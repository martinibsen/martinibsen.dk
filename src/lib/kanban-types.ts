// Shared Kanban types used by both server (storage / API) and client.

export type Assignee = "martin" | "sophia";
export type ColumnId = "backlog" | "todo" | "done";

export interface Card {
  id: string;
  title: string;
  description: string;
  assignee: Assignee | null;
  column: ColumnId;
  dueDate: string | null; // ISO YYYY-MM-DD
  position: number;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface Board {
  cards: Card[];
  updatedAt: string; // ISO timestamp of last write
}

export const COLUMN_IDS: ColumnId[] = ["backlog", "todo", "done"];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  backlog: "Backlog",
  todo: "To Do",
  done: "Done",
};

export const ASSIGNEE_LABELS: Record<Assignee, string> = {
  martin: "Martin",
  sophia: "Sophia",
};

export function emptyBoard(): Board {
  return { cards: [], updatedAt: new Date().toISOString() };
}
