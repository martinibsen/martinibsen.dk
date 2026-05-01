// Shared types for playbook annotations (reader comments tied to text selections).
// Used by both server (storage / API) and client.

export interface Annotation {
  id: string;
  pageSlug: string; // e.g. "lag-1", "intro", "vaerktojer"
  // Text-quote selector for re-anchoring after edits
  quote: string; // the highlighted text exactly as selected
  contextBefore: string; // ~30 chars before the quote
  contextAfter: string; // ~30 chars after the quote
  paragraphIndex: number; // 0-based index within data-pagefind-body
  // Comment payload
  comment: string;
  author: string; // "" means Anonym
  // Metadata
  createdAt: string; // ISO timestamp
}

export interface AnnotationsByPage {
  // pageSlug -> list of annotations
  [pageSlug: string]: Annotation[];
}

export const MAX_COMMENT_LEN = 500;
export const MAX_AUTHOR_LEN = 80;
export const MAX_QUOTE_LEN = 800;
export const MAX_CONTEXT_LEN = 60;
