import type { APIRoute } from "astro";

export const prerender = false;

const MAILING_LIST_ID = "cmnoyb3oh0fgg0i09by1m9019";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.LOOPS_API_KEY;
  if (!apiKey) {
    return json(500, { ok: false, error: "Server ikke konfigureret." });
  }

  let email = "";
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = (await request.json()) as { email?: unknown };
      email = typeof body.email === "string" ? body.email.trim() : "";
    } else {
      const form = await request.formData();
      email = String(form.get("email") || "").trim();
    }
  } catch {
    return json(400, { ok: false, error: "Ugyldig request." });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return json(400, { ok: false, error: "Indtast en gyldig email." });
  }

  try {
    const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: "ai.martinibsen.dk",
        mailingLists: { [MAILING_LIST_ID]: true },
      }),
    });

    if (res.status === 409) {
      return json(200, {
        ok: true,
        message: "Du er allerede tilmeldt. Vi ses mandag.",
      });
    }

    if (!res.ok) {
      return json(502, {
        ok: false,
        error: "Noget gik galt. Prøv igen om et øjeblik.",
      });
    }

    return json(200, {
      ok: true,
      message: "Tak! Du får dit første tip mandag morgen.",
    });
  } catch {
    return json(502, {
      ok: false,
      error: "Noget gik galt. Prøv igen om et øjeblik.",
    });
  }
};
