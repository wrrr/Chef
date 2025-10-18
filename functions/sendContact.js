// functions/sendContact.js

// ---------- helpers ----------
function normalizeEmails(value) {
  if (!value) return [];
  return String(value)
    .split(/[,;]+/)                  // support comma/semicolon lists
    .map(s => s.trim())
    // If it's "Name <email@x.com>", extract the part inside < >
    .map(s => {
      const m = s.match(/<([^>]+)>/);
      return m ? m[1] : s;
    })
    // strip wrapping straight/smart quotes
    .map(s => s.replace(/^["'“”‘’]|["'“”‘’]$/g, ""))
    // remove internal spaces just in case
    .map(s => s.replace(/\s+/g, ""))
    .filter(Boolean);
}
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// CORS: locked to prod origin
const CORS = {
  "Access-Control-Allow-Origin": "https://chefs2table.com",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, cf-turnstile-response",
};

// ---------- Turnstile ----------
function extractTurnstileToken(request, data) {
  const candidates = [
    data?.turnstileToken,
    data?.cf_turnstile,
    data?.cfTurnstile,
    data?.token,
  ].filter(Boolean);
  if (candidates.length) return String(candidates[0]);
  const hdr = request.headers.get("cf-turnstile-response");
  return hdr ? String(hdr) : "";
}

async function verifyTurnstile({ request, env, token }) {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("Missing TURNSTILE_SECRET_KEY secret");
    return { ok: false, status: 500, msg: "Server misconfiguration: missing TURNSTILE_SECRET_KEY" };
  }
  if (!token) {
    return { ok: false, status: 400, msg: "Turnstile token missing" };
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const form = new URLSearchParams();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const out = await res.json();
    if (out?.success === true) return { ok: true };
    console.error("Turnstile verification failed:", out);
    return { ok: false, status: 400, msg: "Turnstile verification failed" };
  } catch (e) {
    console.error("Turnstile verify error:", e);
    return { ok: false, status: 502, msg: "Turnstile verification error" };
  }
}

// ---------- Simple IP rate limiter (in-memory, best-effort) ----------
const RATE_LIMIT = { windowSec: 60, max: 5 }; // 5 requests / 60s per IP
// One map shared per isolate; may not be global across all edge nodes.
globalThis.__RL__ = globalThis.__RL__ || new Map();
/**
 * Returns { allowed:boolean, retryAfter:number }
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = RATE_LIMIT.windowSec * 1000;
  const rec = globalThis.__RL__.get(ip) || [];
  const recent = rec.filter(ts => now - ts < windowMs);

  if (recent.length >= RATE_LIMIT.max) {
    const earliest = Math.min(...recent);
    const retryMs = windowMs - (now - earliest);
    const retryAfter = Math.max(1, Math.ceil(retryMs / 1000));
    globalThis.__RL__.set(ip, recent);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  globalThis.__RL__.set(ip, recent);

  // light cleanup to stop unbounded growth
  if (globalThis.__RL__.size > 2000) {
    for (const [k, arr] of globalThis.__RL__) {
      const pruned = arr.filter(ts => now - ts < windowMs);
      if (pruned.length) globalThis.__RL__.set(k, pruned);
      else globalThis.__RL__.delete(k);
    }
  }

  return { allowed: true, retryAfter: 0 };
}

// ---------- SMTP2GO sender ----------
async function smtp2goSend(env, payload) {
  const res = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Smtp2go-Api-Key": env.SMTP2GO_API_KEY, // full key with 'api-' prefix
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let result;
  try {
    result = await res.json();
  } catch {
    result = null;
  }
  const ok = res.ok && result?.data?.succeeded === 1;
  return { ok, status: res.status, result };
}

// ---------- main handler ----------
export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (method === "GET") {
    // health check to verify that this Function is actually bound to the route
    return new Response("sendContact function is attached (GET)", {
      status: 200,
      headers: CORS,
    });
  }

  if (method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...CORS, Allow: "POST, GET, OPTIONS" },
    });
  }

  // Content-Type guard
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return new Response("Content-Type must be application/json", {
      status: 415,
      headers: CORS,
    });
  }

  // Parse body
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: CORS });
  }

  const { name, email, message } = data || {};
  if (!name || !email || !message) {
    return new Response("All fields are required", { status: 400, headers: CORS });
  }
  if (!isEmail(email)) {
    return new Response("Invalid email address", { status: 400, headers: CORS });
  }

  // Turnstile (bots get filtered here first)
  const token = extractTurnstileToken(request, data);
  const t = await verifyTurnstile({ request, env, token });
  if (!t.ok) {
    return new Response(t.msg, { status: t.status, headers: CORS });
  }

  // Rate limit (apply AFTER Turnstile success; counts only verified attempts)
  const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: { ...CORS, "Retry-After": String(rl.retryAfter) },
    });
  }

  // Normalize env vars
  const toList = normalizeEmails(env.RECEIVE_TO);
  const fromAddr = normalizeEmails(env.SEND_FROM)[0] || "";

  if (!toList.length || !toList.every(isEmail)) {
    console.error("Invalid RECEIVE_TO env (raw):", env.RECEIVE_TO);
    console.error("Invalid RECEIVE_TO env (normalized):", toList);
    return new Response("Server misconfiguration: invalid RECEIVE_TO", { status: 500, headers: CORS });
  }
  if (!isEmail(fromAddr)) {
    console.error("Invalid SEND_FROM env (raw):", env.SEND_FROM);
    console.error("Invalid SEND_FROM env (normalized):", fromAddr);
    return new Response("Server misconfiguration: invalid SEND_FROM", { status: 500, headers: CORS });
  }
  if (!env.SMTP2GO_API_KEY) {
    console.error("Missing SMTP2GO_API_KEY secret");
    return new Response("Server misconfiguration: missing SMTP2GO_API_KEY", { status: 500, headers: CORS });
  }

  // 1) Send internal notification to your team
  const notifyPayload = {
    to: toList,                       // array of clean addresses
    sender: fromAddr,                 // must be a verified sender in SMTP2GO
    subject: `New Contact Form Submission from ${name}`,
    text_body: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    html_body: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>`,
    custom_headers: [{ header: "Reply-To", value: email }],
  };

  const notifyRes = await smtp2goSend(env, notifyPayload);
  if (!notifyRes.ok) {
    console.error("SMTP2GO notify error:", notifyRes.result || notifyRes.status);
    return new Response("Failed to send message", { status: 502, headers: CORS });
  }

  // 2) Send a confirmation email back to the form filler (best-effort)
  //    Uses the same verified sender; "to" is the submitter's email.
  const safeName = String(name).trim() || "there";
  const userSubject = "Thanks — we received your message";
  const userText =
`Hi ${safeName},

Thanks for reaching out to Chefs2Table! We received your message and a team member will reply soon.

Here’s a copy of what you sent:
--------------------------------
Name: ${name}
Email: ${email}
Message:
${message}

If you didn’t submit this, please ignore this email.

— Chefs2Table`;
  const userHtml =
`<p>Hi ${escapeHtml(safeName)},</p>
<p>Thanks for reaching out to <strong>Chefs2Table</strong>! We received your message and a team member will reply soon.</p>
<p><em>Here’s a copy of what you sent:</em></p>
<hr/>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Message:</strong><br/>${escapeHtml(String(message)).replace(/\n/g, "<br/>")}</p>
<hr/>
<p>If you didn’t submit this, please ignore this email.</p>
<p>— Chefs2Table</p>`;

  const autorespPayload = {
    to: [email],
    sender: fromAddr,                 // still your verified domain
    subject: userSubject,
    text_body: userText,
    html_body: userHtml,
    custom_headers: [{ header: "Reply-To", value: fromAddr }],
  };

  try {
    const autoRes = await smtp2goSend(env, autorespPayload);
    if (!autoRes.ok) {
      console.error("SMTP2GO autoresponder error:", autoRes.result || autoRes.status);
      // Do NOT fail the whole request if the autoresponder fails.
    }
  } catch (e) {
    console.error("Autoresponder send error:", e);
  }

  return new Response("Message sent successfully", { status: 200, headers: CORS });
}

// Minimal HTML escaping for the echo-back section
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
