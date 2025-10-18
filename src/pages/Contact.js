// src/pages/Contact.js
import React, { useEffect, useRef, useState } from "react";
import "./Contact.css"; // keep your styles

// Replace with your real Turnstile **site** key string
const TURNSTILE_SITE_KEY = "0x4AAAAAAB7MQ0uzOgJiN9fM";

export default function Contact() {
  const widgetRef = useRef(null);
  const tokenRef = useRef("");
  const [status, setStatus] = useState(null);

  // Load Turnstile script and render widget
  useEffect(() => {
    function render() {
      if (!window.turnstile) return;
      window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          tokenRef.current = token;
        },
        "error-callback": () => {
          tokenRef.current = "";
        },
        "expired-callback": () => {
          tokenRef.current = "";
        },
        theme: "light",
      });
    }

    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.body.appendChild(s);
    } else {
      render();
    }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const token = tokenRef.current;
    if (!token) {
      setStatus({ ok: false, msg: "Please complete the CAPTCHA." });
      return;
    }

    try {
      const res = await fetch("/sendContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cf-turnstile-response": token,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus({ ok: true, msg: "Message sent successfully!" });
        form.reset();
        // reset widget for next submission
        if (window.turnstile) window.turnstile.reset(widgetRef.current);
      } else {
        const text = await res.text();
        setStatus({ ok: false, msg: text || "Failed to send message." });
      }
    } catch (err) {
      setStatus({ ok: false, msg: "Network error. Please try again." });
    }
  }

  return (
    <main className="contact-page">
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>

        <label>
          Email
          <input type="email" name="email" required />
        </label>

        <label>
          Message
          <textarea name="message" rows="5" required />
        </label>

        <div ref={widgetRef} style={{ margin: "8px 0" }} />

        <button type="submit">Send</button>

        {status && (
          <p
            style={{
              marginTop: 10,
              color: status.ok ? "green" : "#9b1c18",
              fontWeight: 600,
            }}
          >
            {status.msg}
          </p>
        )}
      </form>
    </main>
  );
}