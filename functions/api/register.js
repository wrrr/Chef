// functions/api/chefs/register.js

const ORIGIN = "https://chefs2table.com"; // tighten as needed

const CORS = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function j(s) { return typeof s === "string" ? s.trim() : s; }
function toCSV(a) { return Array.isArray(a) ? a.join(", ") : (a || ""); }

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (method !== "POST")   return new Response("Method Not Allowed", { status: 405, headers: CORS });

  // Parse JSON
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  }

  // Turnstile verification
  try {
    const token = j(data.turnstile_token);
    if (!token) throw new Error("Missing Turnstile token");

    const ip = request.headers.get("cf-connecting-ip") || "";
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return new Response(JSON.stringify({ error: "Turnstile verification failed" }), { status: 403, headers: { ...CORS, "Content-Type": "application/json" } });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Captcha error" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  }

  // Required fields
  const name = j(data.name);
  const city = j(data.city)?.toLowerCase();
  const email = j(data.email);

  if (!name || !city || !email) {
    return new Response(JSON.stringify({ error: "name, city, and email are required" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  }

  // Optional fields
  const phone = j(data.phone);
  const website = j(data.website);
  const bio = j(data.bio);
  const photo_url = j(data.photo_url);

  const linkedin = j(data.linkedin);
  const instagram = j(data.instagram);
  const tiktok = j(data.tiktok);
  const youtube = j(data.youtube);
  const facebook = j(data.facebook);
  const yelp = j(data.yelp);
  const opentable = j(data.opentable);

  // specialties: array or CSV string
  const specialties = Array.isArray(data.specialties)
    ? data.specialties.map(j).filter(Boolean)
    : String(data.specialties || "").split(",").map((s) => s.trim()).filter(Boolean);

  const id = crypto.randomUUID();

  // Insert into D1
  try {
    const stmt = env.chefs2table.prepare(
      `INSERT INTO chefs (
        id, name, city, specialties, bio, photo_url, website, email, phone,
        linkedin, instagram, tiktok, youtube, facebook, yelp, opentable, status
       ) VALUES (
        ?,  ?,    ?,    ?,           ?,   ?,         ?,       ?,     ?,
        ?,        ?,         ?,      ?,      ?,        ?,    ?,        'pending'
       )`
    );

    await stmt.bind(
      id, name, city, toCSV(specialties), bio, photo_url, website, email, phone,
      linkedin, instagram, tiktok, youtube, facebook, yelp, opentable
    ).run();

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("D1 insert error:", e);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}