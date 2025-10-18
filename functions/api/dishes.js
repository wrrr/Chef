// functions/api/dishes.js
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
};

function toInt(v, d) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
}

function imgFromPublicId(hash, publicId, variant = "public") {
  if (!hash || !publicId) return null;
  return `https://imagedelivery.net/${hash}/${publicId}/${variant}`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const city = (url.searchParams.get("city") || "").toLowerCase().trim();
  const chefId = url.searchParams.get("chef_id");
  const limit = Math.min(toInt(url.searchParams.get("limit"), 12), 50);
  const offset = toInt(url.searchParams.get("offset"), 0);

  try {
    let rows;
    if (chefId) {
      // by specific chef
      rows = await env.chefs2table
        .prepare(
          `
          SELECT
            d.id, d.chef_id, d.name, d.description, d.price_cents, d.currency,
            d.categories, d.tags,
            (
              SELECT di.public_id
              FROM dish_images di
              WHERE di.dish_id = d.id AND di.status='approved'
              ORDER BY di.is_primary DESC, di.id DESC
              LIMIT 1
            ) AS image_public_id,
            (
              SELECT di.image_url
              FROM dish_images di
              WHERE di.dish_id = d.id AND di.status='approved'
              ORDER BY di.is_primary DESC, di.id DESC
              LIMIT 1
            ) AS image_url
          FROM dishes d
          WHERE d.chef_id = ? AND d.active = 1
          ORDER BY d.created_at DESC
          LIMIT ? OFFSET ?
        `
        )
        .bind(chefId, limit, offset)
        .all();
    } else if (city) {
      // by city: latest dishes from chefs in that city
      rows = await env.chefs2table
        .prepare(
          `
          SELECT
            d.id, d.chef_id, d.name, d.description, d.price_cents, d.currency,
            d.categories, d.tags,
            c.name as chef_name, c.city as chef_city,
            (
              SELECT di.public_id
              FROM dish_images di
              WHERE di.dish_id = d.id AND di.status='approved'
              ORDER BY di.is_primary DESC, di.id DESC
              LIMIT 1
            ) AS image_public_id,
            (
              SELECT di.image_url
              FROM dish_images di
              WHERE di.dish_id = d.id AND di.status='approved'
              ORDER BY di.is_primary DESC, di.id DESC
              LIMIT 1
            ) AS image_url
          FROM dishes d
          JOIN chefs c ON c.id = d.chef_id
          WHERE lower(c.city) = ? AND d.active = 1
          ORDER BY d.created_at DESC
          LIMIT ? OFFSET ?
        `
        )
        .bind(city, limit, offset)
        .all();
    } else {
      rows = { results: [] };
    }

    const accountHash = env.IMAGES_ACCOUNT_HASH || env.IMAGES_ACCOUNT || env.CF_IMAGES_HASH;

    const dishes = (rows?.results || []).map((r) => {
      const url =
        r.image_url ||
        (r.image_public_id ? imgFromPublicId(accountHash, r.image_public_id, "public") : null);
      return {
        id: r.id,
        chef_id: r.chef_id,
        name: r.name,
        description: r.description,
        price_cents: r.price_cents,
        currency: r.currency || "USD",
        categories: r.categories,
        tags: r.tags,
        chef_name: r.chef_name,
        chef_city: r.chef_city,
        image: url,
      };
    });

    return new Response(
      JSON.stringify({
        count: dishes.length,
        dishes,
      }),
      { status: 200, headers: { ...CORS, "content-type": "application/json" } }
    );
  } catch (err) {
    console.error("GET /api/dishes error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }
}