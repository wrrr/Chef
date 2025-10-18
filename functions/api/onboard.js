// functions/api/onboard.js
// Creates a pending chef record after verifying Cloudflare Turnstile.
// Expects JSON; accepts the Turnstile token either in body.turnstileToken
// or the 'cf-turnstile-response' request header.

const ORIGIN = "https://chefs2table.com"; // tighten as needed
const CORS = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, cf-turnstile-response",
};

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
const stripQuotes = (s) => (typeof s === "string" ? s.replace(/^["'“”‘’]|["'“”‘’]$/g, "") : s);

async function verifyTurnstile(secret, token, ip) {
  if (!secret) return { success: false, code: "missing-secret" };
  if (!token)  return { success: false, code: "missing-token" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const json = await resp.json().catch(() => ({}));
  return json;
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), {
      status: 415,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Gather fields
  const {
    name, email, phone,
    city, specialties, bio,
    website, instagram, tiktok, youtube, facebook, linkedin, yelp, opentable,
    turnstileToken,
  } = data || {};

  // Turnstile token (header OR body)
  const tokenFromHeader = request.headers.get("cf-turnstile-response");
  const tsToken = stripQuotes(tokenFromHeader || turnstileToken || "");
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "";

  // Verify Turnstile
  const tsResult = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, tsToken, ip);
  if (!tsResult?.success) {
    return new Response(JSON.stringify({ error: "Turnstile verification failed", details: tsResult }), {
      status: 403,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Basic validation
  if (!name || !email || !city) {
    return new Response(JSON.stringify({ error: "name, email, and city are required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
  if (!isEmail(email)) {
    return new Response(JSON.stringify({ error: "Invalid email address" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Insert into D1 (pending status)
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = env.chefs2table.prepare(`
      INSERT INTO chefs (
        id, name, city, specialties, bio,
        website, instagram, tiktok, youtube, facebook, linkedin, yelp, opentable,
        email, phone, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `);

    await stmt
      .bind(
        id,
        String(name).trim(),
        String(city).trim().toLowerCase(),
        specialties ? String(specialties).trim() : null,
        bio ? String(bio).trim() : null,
        website || null, instagram || null, tiktok || null, youtube || null,
        facebook || null, linkedin || null, yelp || null, opentable || null,
        email, phone || null,
        now
      )
      .run();

    return new Response(JSON.stringify({ ok: true, id, review: "pending" }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("D1 insert error:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}