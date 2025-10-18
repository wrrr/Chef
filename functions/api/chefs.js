// functions/api/chefs.js
const CORS = {
  "Access-Control-Allow-Origin": "https://chefs2table.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...CORS, Allow: "GET, OPTIONS" },
    });
  }

  // Parse query params
  const url = new URL(request.url);
  const city = (url.searchParams.get("city") || "").toLowerCase().trim() || null; // e.g., "austin"
  const limitRaw = url.searchParams.get("limit");
  const shuffle = (url.searchParams.get("shuffle") || "1") === "1"; // default true
  let limit = Number.parseInt(limitRaw || "50", 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 50;
  if (limit > 100) limit = 100;

  // Build SQL
  // Only approved chefs; optional city filter; optionally randomize order
  const whereCity = city ? "AND city = ?1" : "";
  const order = shuffle ? "ORDER BY RANDOM()" : "ORDER BY created_at DESC";
  const sql = `
    SELECT
      id, name, city, specialties, bio, photo_url, website, email, phone,
      linkedin, instagram, tiktok, youtube, facebook, yelp, opentable,
      status, created_at, updated_at
    FROM chefs
    WHERE status = 'approved' ${whereCity}
    ${order}
    LIMIT ?2
  `;

  try {
    const stmt = env.chefs2table.prepare(sql);
    const res = city
      ? await stmt.bind(city, limit).all()
      : await stmt.bind(limit).all(); // when no city, the ?1 is unused; bind only limit

    return new Response(
      JSON.stringify({
        city: city || null,
        count: res.results?.length || 0,
        chefs: res.results || [],
      }),
      {
        status: 200,
        headers: {
          ...CORS,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=30, s-maxage=60",
        },
      }
    );
  } catch (err) {
    console.error("D1 query error:", err);
    return new Response("Server error", { status: 500, headers: CORS });
  }
}
