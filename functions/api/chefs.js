// functions/api/chef.js
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing ?id" }), {
      status: 400,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  try {
    const row = await env.chefs2table
      .prepare(`
        SELECT
          id, name, city, specialties, bio, photo_url, website, email, phone,
          instagram, linkedin, tiktok, youtube, facebook, yelp, opentable
        FROM chefs
        WHERE id = ? AND (status = 'approved' OR status = 'pending')
        LIMIT 1
      `)
      .bind(id)
      .first();

    if (!row) {
      return new Response(JSON.stringify({ error: "Chef not found" }), {
        status: 404,
        headers: { ...CORS, "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ chef: row }), {
      status: 200,
      headers: { ...CORS, "content-type": "application/json" },
    });
  } catch (err) {
    console.error("GET /api/chef error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }
}