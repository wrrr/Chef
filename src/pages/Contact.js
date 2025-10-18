// src/pages/Contact.js
import React, { useEffect, useRef, useState } from "react";
import "./Contact.css"; // stylesheet in the same folder

const TURNSTILE_SITE_KEY = "0x4AAAAAAB7MQ0uzOgJiN9fM"; // <-- put your SITE key here

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({ kind: "idle", msg: "" }); // idle|sending|ok|err
  const [scriptReady, setScriptReady] = useState(false);
  const widgetRef = useRef(null);

  // Load Turnstile script once
  useEffect(() => {
    const EXISTING_ID = "cf-turnstile-script";
    if (document.getElementById(EXISTING_ID)) {
      setScriptReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.id = EXISTING_ID;
    s.onload = () => setScriptReady(true);
    document.head.appendChild(s);
  }, []);

  // Expose a stable callback for Turnstile to call
  useEffect(() => {
    // Cloudflare Turnstile will call window.onTurnstileOK(token)
    window.onTurnstileOK = (tkn) => {
      setToken(tkn || "");
    };
    return () => {
      try {
        delete window.onTurnstileOK;
      } catch {
        window.onTurnstileOK = undefined;
      }
    };
  }, []);

  // (Re)render/refresh widget when script is ready
  useEffect(() => {
    if (!scriptReady || !widgetRef.current) return;
    if (window.turnstile?.reset) {
      try {
        window.turnstile.reset(widgetRef.current);
      } catch {
        // ignore
      }
    }
  }, [scriptReady]);

  async function handleSubmit(e) {
    e.preventDefault();

    // basic client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ kind: "err", msg: "Please fill out all fields." });
      return;
    }
    if (!token) {
      setStatus({ kind: "err", msg: "Please complete the Turnstile challenge." });
      return;
    }

    setStatus({ kind: "sending", msg: "Sending..." });

    try {
      const res = await fetch("/sendContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          turnstileToken: token,
        }),
      });

      const text = await res.text();
      if (res.ok) {
        setStatus({ kind: "ok", msg: "Message sent! We’ll get back to you soon." });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          kind: "err",
          msg: text || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        kind: "err",
        msg: "Network error. Please check your connection and try again.",
      });
    } finally {
      // Refresh Turnstile for another submission
      if (window.turnstile?.reset && widgetRef.current) {
        try {
          window.turnstile.reset(widgetRef.current);
        } catch {
          // ignore
        }
      }
      setToken("");
    }
  }

  return (
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Message</span>
          <textarea
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        {/* Turnstile widget */}
        <div
          ref={widgetRef}
          className="cf-turnstile"
          data-sitekey={TURNSTILE_SITE_KEY}
          data-callback="onTurnstileOK"
          data-theme="light"
          style={{ margin: "12px 0" }}
        />
        {!scriptReady && (
          <div className="help-text">Loading verification…</div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={status.kind === "sending"}
        >
          {status.kind === "sending" ? "Sending…" : "Send Message"}
        </button>

        {status.kind === "ok" && (
          <div className="status ok" role="status">
            {status.msg}
          </div>
        )}
        {status.kind === "err" && (
          <div className="status err" role="alert">
            {status.msg}
          </div>
        )}
      </form>

      <noscript>
        <p style={{ color: "crimson", marginTop: 12 }}>
          JavaScript is required to submit this form securely.
        </p>
      </noscript>
    </div>
  );
}
