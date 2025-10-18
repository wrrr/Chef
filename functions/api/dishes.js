const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function toArray(value) {
  if (!value) return [];
  const s = String(value).trim();
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
  } catch {
    // CSV fallback
    return s
      .split(/[,;]+/)
      .map(v => v.trim())
      .filter(Boolean);
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
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

  const city = (url.searchParams.get("city") || "").toLowerCase().trim();
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "12", 10) || 12, 50);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);

  if (!city) {
    return new Response(JSON.stringify({ error: "city is required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // D1 binding: env.chefs2table (as configured in wrangler.toml)
  const db = env.chefs2table;

  const sql = `
    SELECT
      d.id, d.chef_id, d.name, d.description,
      d.price_cents, d.currency, d.categories, d.tags,
      COALESCE(di.public_id, '')  AS image_public_id,
      COALESCE(di.image_url,  '') AS image_url
    FROM dishes d
    JOIN chefs c ON c.id = d.chef_id
    LEFT JOIN dish_images di
      ON di.dish_id = d.id AND di.is_primary = 1 AND di.status = 'approved'
    WHERE c.status = 'approved'
      AND LOWER(c.city) = ?
      AND d.active = 1
    ORDER BY d.created_at DESC, d.id DESC
    LIMIT ? OFFSET ?;
  `;

  try {
    const { results } = await db.prepare(sql).bind(city, limit, offset).all();

    const dishes = (results || []).map(row => ({
      id: row.id,
      chef_id: row.chef_id,
      name: row.name,
      description: row.description,
      price_cents: row.price_cents,
      currency: row.currency || "USD",
      categories: toArray(row.categories),
      tags: toArray(row.tags),
      // Prefer Cloudflare Images delivery if public_id is present
      image: row.image_public_id
        ? {
            public_id: row.image_public_id,
            // Example variant path; adjust to your Images variant if you have one
            url: `https://imagedelivery.net/${env.IMAGES_ACCOUNT_HASH}/${row.image_public_id}/public`,
          }
        : (row.image_url ? { url: row.image_url } : null),
    }));

    const body = JSON.stringify({ city, count: dishes.length, dishes });
    return new Response(body, { status: 200, headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Error querying dishes:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
