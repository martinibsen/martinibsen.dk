export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    let email = "";
    try {
        const body = await request.json();
        email = String(body?.email ?? "").trim();
    } catch {
        return jsonError("Bad request", 400);
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return jsonError("Invalid email", 400);
    }

    const apiKey = import.meta.env.LOOPS_API_KEY;
    if (!apiKey) {
        return jsonError("Server not configured (LOOPS_API_KEY missing)", 500);
    }

    try {
        const res = await fetch("https://app.loops.so/api/v1/contacts/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                email,
                source: "wardrobe",
                mailingLists: { wardrobe: true },
            }),
        });
        if (!res.ok) {
            return jsonError("Loops error", 500);
        }
        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return jsonError("Network error", 500);
    }
};

function jsonError(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}
