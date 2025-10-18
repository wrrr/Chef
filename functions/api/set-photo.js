// functions/api/chefs/set-photo.js

const CORS = {
  "Access-Control-Allow-Origin": "https://chefs2table.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
};

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });
  }

  // simple admin auth
  const token = request.headers.get("X-Admin-Token") || "";
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response("Unauthorized", { status: 401, headers: CORS });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return new Response("Content-Type must be application/json", { status: 415, headers: CORS });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: CORS });
  }

  const chefId = String(body?.chefId || "").trim();
  const url = String(body?.photo_url || "").trim();
  if (!chefId || !url) {
    return new Response("chefId and photo_url required", { status: 400, headers: CORS });
  }

  try {
    const stmt = env.chefs2table.prepare(
      "UPDATE chefs SET photo_url=?1 WHERE id=?2"
    );
    const res = await stmt.bind(url, chefId).run();

    if (res.meta.changes === 0) {
      return new Response("Chef not found", { status: 404, headers: CORS });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    console.error("D1 update error:", err);
    return new Response("Server error", { status: 500, headers: CORS });
  }
}
