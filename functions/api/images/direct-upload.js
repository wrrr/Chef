// functions/api/images/direct-upload.js

// CORS: lock to your prod origin
const CORS = {
  "Access-Control-Allow-Origin": "https://chefs2table.com",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (method === "GET") {
    // simple health check
    return new Response("images/direct-upload ready", { status: 200, headers: CORS });
  }

  if (method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...CORS, Allow: "POST, GET, OPTIONS" },
    });
  }

  // --- validate env ---
  const accountId = env.CF_ACCOUNT_ID;         // long hex (your Cloudflare Account ID)
  const apiToken  = env.IMAGES_API_TOKEN;      // API Token with Cloudflare Images:Edit
  const hash      = env.IMAGES_ACCOUNT_HASH;   // short Images account hash for delivery URLs

  if (!accountId || !apiToken || !hash) {
    console.error("Missing Images secrets/bindings", {
      hasAccountId: !!accountId,
      hasToken: !!apiToken,
      hasHash: !!hash,
    });
    return new Response("Server misconfiguration", { status: 500, headers: CORS });
  }

  // Optional: parse a JSON body to accept a filename or expiry, but it's not required.
  // Cloudflare supports an optional "requireSignedURLs" or "metadata"—we keep it simple here.
  let ttlSeconds = 10 * 60; // 10 minutes for the client to upload
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      if (Number.isFinite(body?.ttlSeconds) && body.ttlSeconds > 0 && body.ttlSeconds <= 3600) {
        ttlSeconds = Math.floor(body.ttlSeconds);
      }
    }
  } catch {
    // ignore parse errors; keep defaults
  }

  // --- request a direct upload URL from Cloudflare Images ---
  // API: POST /accounts/:account_id/images/v2/direct_upload
  // Docs return fields like: { result: { uploadURL, id }, success: true, ... }
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`;
  const form = new FormData();
  form.append("requireSignedURLs", "false");
  // You can pass metadata fields if you like: form.append("metadata", JSON.stringify({ source: "chefs2table" }));
  form.append("expiry", new Date(Date.now() + ttlSeconds * 1000).toISOString());

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: form,
    });

    const out = await res.json();

    if (!res.ok || !out?.success || !out?.result?.uploadURL || !out?.result?.id) {
      console.error("Images direct_upload error:", out);
      return new Response("Failed to create direct upload URL", { status: 502, headers: CORS });
    }

    const { uploadURL, id } = out.result;

    // Build a convenient delivery URL pattern for the client (they can choose variants like /public, /thumbnail, etc.)
    const delivery = `https://imagedelivery.net/${hash}/${id}/public`;

    return new Response(
      JSON.stringify({
        id,
        uploadURL,
        deliveryURL: delivery,
        expiresIn: ttlSeconds,
      }),
      {
        status: 200,
        headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
      }
    );
  } catch (err) {
    console.error("Images API error:", err);
    return new Response("Images API error", { status: 500, headers: CORS });
  }
}
