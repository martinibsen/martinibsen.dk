// Playbook annotations API.
// GET    /api/playbook-annotations?slug=lag-1   -> { ok: true, annotations: [...] }
// GET    /api/playbook-annotations              -> { ok: true, annotations: AnnotationsByPage } (admin only)
// POST   /api/playbook-annotations              -> { ok: true, annotation } (body: NewAnnotationInput)
// DELETE /api/playbook-annotations?id=xxx       -> { ok: true } (admin only, requires Bearer token)

import type { APIRoute } from "astro";
import {
  appendAnnotation,
  deleteAnnotation,
  readAll,
  readForPage,
} from "../../lib/playbook-annotations-storage";
import type { Annotation } from "../../lib/playbook-annotations-types";
import {
  MAX_AUTHOR_LEN,
  MAX_COMMENT_LEN,
  MAX_CONTEXT_LEN,
  MAX_QUOTE_LEN,
} from "../../lib/playbook-annotations-types";

export const prerender = false;

const VALID_SLUGS = new Set([
  "intro",
  "lag-1",
  "lag-2",
  "lag-3",
  "lag-4",
  "lag-5",
  "vaerktojer",
]);

const json = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

function isAdmin(request: Request): boolean {
  // Astro/Vite loads .env into import.meta.env at build time; Netlify exposes
  // env vars there too in production. Fall back to process.env just in case.
  const expected =
    (import.meta.env.ADMIN_TOKEN as string | undefined) ??
    process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;
  return match[1] === expected;
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const slug = url.searchParams.get("slug");
    if (slug) {
      if (!VALID_SLUGS.has(slug)) {
        return json(400, { ok: false, error: "Ukendt side." });
      }
      const annotations = await readForPage(slug);
      return json(200, { ok: true, annotations });
    }
    // No slug → admin overview, requires token
    if (!isAdmin(request)) {
      return json(401, { ok: false, error: "Unauthorized." });
    }
    const all = await readAll();
    return json(200, { ok: true, annotations: all });
  } catch (err) {
    console.error("[annotations] GET failed", err);
    return json(500, { ok: false, error: "Kunne ikke hente kommentarer." });
  }
};

export const POST: APIRoute = async ({ request }) => {
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return json(400, { ok: false, error: "Ugyldig JSON." });
  }

  const body = parsed as Record<string, unknown>;

  // Honeypot — bots fill any input they see; humans never see this field.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    // Pretend success without storing — silent reject.
    return json(200, { ok: true, annotation: null });
  }

  const slug = strField(body.pageSlug);
  if (!slug || !VALID_SLUGS.has(slug)) {
    return json(400, { ok: false, error: "Ugyldig side." });
  }

  const quote = strField(body.quote, MAX_QUOTE_LEN);
  if (!quote || quote.length < 3) {
    return json(400, { ok: false, error: "Citat mangler." });
  }

  const comment = strField(body.comment, MAX_COMMENT_LEN);
  if (!comment || comment.length < 2) {
    return json(400, { ok: false, error: "Skriv en kommentar." });
  }

  const author = strField(body.author, MAX_AUTHOR_LEN) ?? "";
  const contextBefore = strField(body.contextBefore, MAX_CONTEXT_LEN) ?? "";
  const contextAfter = strField(body.contextAfter, MAX_CONTEXT_LEN) ?? "";

  const paragraphIndex =
    typeof body.paragraphIndex === "number" && Number.isFinite(body.paragraphIndex)
      ? Math.max(0, Math.floor(body.paragraphIndex))
      : 0;

  const annotation: Annotation = {
    id: crypto.randomUUID(),
    pageSlug: slug,
    quote,
    contextBefore,
    contextAfter,
    paragraphIndex,
    comment,
    author,
    createdAt: new Date().toISOString(),
  };

  try {
    const saved = await appendAnnotation(annotation);
    return json(201, { ok: true, annotation: saved });
  } catch (err) {
    console.error("[annotations] POST failed", err);
    return json(500, { ok: false, error: "Kunne ikke gemme kommentar." });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  if (!isAdmin(request)) {
    return json(401, { ok: false, error: "Unauthorized." });
  }
  const id = url.searchParams.get("id");
  if (!id) return json(400, { ok: false, error: "Mangler id." });
  try {
    const removed = await deleteAnnotation(id);
    return json(200, { ok: removed });
  } catch (err) {
    console.error("[annotations] DELETE failed", err);
    return json(500, { ok: false, error: "Kunne ikke slette." });
  }
};

// ---- helpers ----

function strField(v: unknown, max?: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (t.length === 0) return null;
  return max ? t.slice(0, max) : t;
}
