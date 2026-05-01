// Server-only storage layer for playbook annotations.
// Persists one document in Netlify Blobs, keyed by `index`, holding all
// annotations grouped by page slug. The volume is small enough that a
// single document keeps things simple — we can split per-slug later if
// it ever becomes a hotspot.

import { getStore, type Store } from "@netlify/blobs";
import type { Annotation, AnnotationsByPage } from "./playbook-annotations-types";

const STORE_NAME = "playbook-annotations";
const INDEX_KEY = "index";

function store(): Store {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function readAll(): Promise<AnnotationsByPage> {
  const raw = await store().get(INDEX_KEY, { type: "json" });
  if (!raw || typeof raw !== "object") return {};
  // Defensive: ensure each value is an array
  const out: AnnotationsByPage = {};
  for (const [slug, list] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(list)) {
      out[slug] = list as Annotation[];
    }
  }
  return out;
}

export async function readForPage(slug: string): Promise<Annotation[]> {
  const all = await readAll();
  return all[slug] ?? [];
}

export async function writeAll(data: AnnotationsByPage): Promise<void> {
  await store().setJSON(INDEX_KEY, data);
}

export async function appendAnnotation(annotation: Annotation): Promise<Annotation> {
  const all = await readAll();
  const list = all[annotation.pageSlug] ?? [];
  list.push(annotation);
  all[annotation.pageSlug] = list;
  await writeAll(all);
  return annotation;
}

export async function deleteAnnotation(id: string): Promise<boolean> {
  const all = await readAll();
  let removed = false;
  for (const slug of Object.keys(all)) {
    const list = all[slug];
    const next = list.filter((a) => a.id !== id);
    if (next.length !== list.length) {
      all[slug] = next;
      removed = true;
    }
  }
  if (removed) await writeAll(all);
  return removed;
}
