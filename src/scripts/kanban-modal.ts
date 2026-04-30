// Modal logic for creating and editing cards.
// Owns DOM lookups for the dialog and exposes a small open()/close() API.

import type { Assignee, Card, ColumnId } from "../lib/kanban-types";

export interface CardFormResult {
  title: string;
  description: string;
  assignee: Assignee | null;
  column: ColumnId;
  dueDate: string | null;
}

export interface ModalHandlers {
  onSubmit: (existingId: string | null, data: CardFormResult) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface Elements {
  dialog: HTMLDialogElement;
  form: HTMLFormElement;
  title: HTMLHeadingElement;
  closeBtn: HTMLButtonElement;
  cancelBtn: HTMLButtonElement;
  deleteBtn: HTMLButtonElement;
  saveBtn: HTMLButtonElement;
}

export class CardModal {
  private el: Elements;
  private currentId: string | null = null;

  constructor(
    root: ParentNode,
    private handlers: ModalHandlers,
  ) {
    this.el = {
      dialog: req<HTMLDialogElement>(root, "#kb-modal"),
      form: req<HTMLFormElement>(root, "#kb-form"),
      title: req<HTMLHeadingElement>(root, "#kb-modal-title"),
      closeBtn: req<HTMLButtonElement>(root, "#kb-close"),
      cancelBtn: req<HTMLButtonElement>(root, "#kb-cancel"),
      deleteBtn: req<HTMLButtonElement>(root, "#kb-delete"),
      saveBtn: req<HTMLButtonElement>(root, "#kb-save"),
    };
    this.wire();
  }

  openCreate(column: ColumnId): void {
    this.currentId = null;
    this.el.title.textContent = "Nyt kort";
    this.el.deleteBtn.hidden = true;
    this.populate(null, column);
    this.show();
  }

  openEdit(card: Card): void {
    this.currentId = card.id;
    this.el.title.textContent = "Redigér kort";
    this.el.deleteBtn.hidden = false;
    this.populate(card, card.column);
    this.show();
  }

  private show(): void {
    if (!this.el.dialog.open) this.el.dialog.showModal();
    const titleInput = this.el.form.elements.namedItem(
      "title",
    ) as HTMLInputElement | null;
    titleInput?.focus();
    titleInput?.select();
  }

  private close(): void {
    if (this.el.dialog.open) this.el.dialog.close();
    this.currentId = null;
  }

  private populate(card: Card | null, column: ColumnId): void {
    const f = this.el.form;
    setValue(f, "title", card?.title ?? "");
    setValue(f, "description", card?.description ?? "");
    setValue(f, "assignee", card?.assignee ?? "");
    setValue(f, "column", column);
    setValue(f, "dueDate", card?.dueDate ?? "");
  }

  private read(): CardFormResult | null {
    const f = this.el.form;
    const title = getValue(f, "title").trim();
    if (title.length === 0) return null;
    const assignee = getValue(f, "assignee");
    const column = getValue(f, "column") as ColumnId;
    const dueDate = getValue(f, "dueDate").trim();
    return {
      title,
      description: getValue(f, "description"),
      assignee:
        assignee === "martin" || assignee === "sophia" ? assignee : null,
      column,
      dueDate: dueDate.length > 0 ? dueDate : null,
    };
  }

  private wire(): void {
    this.el.closeBtn.addEventListener("click", () => this.close());
    this.el.cancelBtn.addEventListener("click", () => this.close());
    this.el.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.close();
    });
    this.el.deleteBtn.addEventListener("click", async () => {
      if (!this.currentId) return;
      if (!confirm("Slet kortet?")) return;
      const id = this.currentId;
      await this.handlers.onDelete(id);
      this.close();
    });
    this.el.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = this.read();
      if (!data) return;
      await this.handlers.onSubmit(this.currentId, data);
      this.close();
    });
  }
}

function req<T extends Element>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Mangler element: ${selector}`);
  return el;
}

function setValue(form: HTMLFormElement, name: string, value: string): void {
  const el = form.elements.namedItem(name) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  if (el) el.value = value;
}

function getValue(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
  return el?.value ?? "";
}
