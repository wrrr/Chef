// functions/api/images/direct-upload.js

// Allow prod + local dev
const ALLOWED_ORIGINS = new Set([
  "https://chefs2table.com",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
]);

const cors = (origin) => {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://chefs2table.com";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
};

const json = (obj, status = 200, headers = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });

export async function onRequest(context) {
  const { request, env } = context;
  const origin = request.headers.get("origin") || "";
  const CORS = cors(origin);
  const url = new URL(request.url);
  const debug = url.searchParams.has("debug");

  const method = request.method.toUpperCase();
  if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  // Health / diagnostics
  if (method === "GET") {
    if (debug) {
      return json(
        {
          ok: true,
          route: "images/direct-upload",
          env: {
            hasAccountId: !!env.CF_ACCOUNT_ID,
            hasToken: !!env.IMAGES_API_TOKEN,
            hasHash: !!env.IMAGES_ACCOUNT_HASH,
            hasAdminToken: !!env.ADMIN_TOKEN,
            hasTurnstile: !!env.TURNSTILE_SECRET_KEY,
          },
        },
        200,
        CORS
      );
    }
    return new Response("images/direct-upload ready", { status: 200, headers: CORS });
  }

  if (method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...CORS, Allow: "POST, GET, OPTIONS" },
    });
  }

  // --- required envs ---
  const accountId = env.CF_ACCOUNT_ID;
  const apiToken = env.IMAGES_API_TOKEN;
  const hash = env.IMAGES_ACCOUNT_HASH;

  if (!accountId || !apiToken || !hash) {
    return json(
      {
        error: "Server misconfiguration",
        missing: {
          CF_ACCOUNT_ID: !accountId,
          IMAGES_API_TOKEN: !apiToken,
          IMAGES_ACCOUNT_HASH: !hash,
        },
      },
      500,
      CORS
    );
  }

  // Parse JSON body (optional fields: ttlSeconds, metadata, turnstileToken)
  let body = {};
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  // --- auth gate: ADMIN_TOKEN OR Turnstile ---
  const adminBearer = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  let allowed = false;
  let authMethod = "none";

  if (env.ADMIN_TOKEN && adminBearer === env.ADMIN_TOKEN) {
    allowed = true;
    authMethod = "admin";
  } else if (env.TURNSTILE_SECRET_KEY && body?.turnstileToken) {
    try {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: body.turnstileToken,
          remoteip: request.headers.get("cf-connecting-ip") || "",
        }),
      }).then((r) => r.json());
      if (verify?.success) {
        allowed = true;
        authMethod = "turnstile";
      }
    } catch {
      // ignore
    }
  }

  if (!allowed) {
    return json({ error: "Unauthorized" }, 401, CORS);
  }

  // TTL (default 10 min; max 1 hour)
  let ttlSeconds = 600;
  if (Number.isFinite(body?.ttlSeconds) && body.ttlSeconds > 0 && body.ttlSeconds <= 3600) {
    ttlSeconds = Math.floor(body.ttlSeconds);
  }

  // Create a Direct Upload URL
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v2/direct_upload`;
  const form = new FormData();
  form.append("requireSignedURLs", "false");
  form.append("expiry", new Date(Date.now() + ttlSeconds * 1000).toISOString());
  if (body?.metadata && typeof body.metadata === "object") {
    form.append("metadata", JSON.stringify(body.metadata));
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}` },
      body: form,
    });

    const text = await res.text();
    let out;
    try {
      out = JSON.parse(text);
    } catch {
      out = { raw: text };
    }

    if (!res.ok || !out?.success || !out?.result?.uploadURL || !out?.result?.id) {
      return json(
        {
          error: "Images direct_upload failed",
          status: res.status,
          details: out,
        },
        502,
        CORS
      );
    }

    const { uploadURL, id } = out.result;
    const deliveryURL = `https://imagedelivery.net/${hash}/${id}/public`;

    return json(
      { ok: true, auth: authMethod, id, uploadURL, deliveryURL, expiresIn: ttlSeconds },
      200,
      CORS
    );
  } catch (err) {
    return json(
      { error: "Images API error", message: String(err?.message || err) },
      500,
      CORS
    );
  }
}