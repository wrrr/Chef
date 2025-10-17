// functions/sendContact.js

function normalizeEmails(value) {
  if (!value) return [];
  return String(value)
    .split(/[,;]+/)
    .map(s => s.trim().replace(/^["'“”‘’]|["'“”‘’]$/g, ""))
    .filter(Boolean);
}
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const CORS = {
  "Access-Control-Allow-Origin": "*",        // tighten to your domain when ready
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

  // ---- POST handler below ----
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

  // Normalize env vars
  const toList = normalizeEmails(env.RECEIVE_TO);
  const fromAddr = String(env.SEND_FROM || "").trim().replace(/^["'“”‘’]|["'“”‘’]$/g, "");
  if (!toList.length || !toList.every(isEmail)) {
    console.error("Invalid RECEIVE_TO env:", env.RECEIVE_TO);
    return new Response("Server misconfiguration: invalid RECEIVE_TO", { status: 500, headers: CORS });
  }
  if (!isEmail(fromAddr)) {
    console.error("Invalid SEND_FROM env:", env.SEND_FROM);
    return new Response("Server misconfiguration: invalid SEND_FROM", { status: 500, headers: CORS });
  }

  // Build SMTP2GO payload
  const payload = {
    to: toList,
    sender: fromAddr, // must be a verified sender in SMTP2GO
    subject: `New Contact Form Submission from ${name}`,
    text_body: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    html_body: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>`,
    custom_headers: [{ header: "Reply-To", value: email }],
  };

  try {
    const res = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": env.SMTP2GO_API_KEY, // include full key with 'api-' prefix
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result?.data?.succeeded === 1) {
      return new Response("Message sent successfully", { status: 200, headers: CORS });
    } else {
      console.error("SMTP2GO error:", result);
      return new Response("Failed to send message", { status: 502, headers: CORS });
    }
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response("Error sending message", { status: 500, headers: CORS });
  }
}
