// src/pages/JoinOurTeam.js
import React, { useEffect, useState } from "react";
import "./JoinOurTeam.css"; // optional (safe to keep even if empty)

// If you already have a shared cities list, import it.
// Otherwise, fall back to a simple array here.
let CITY_OPTIONS = [
  "Toronto",
  "New York",
  "Boston",
  "Chicago",
  "New Orleans",
  "Austin",
  "Dallas",
  "Houston",
  "Miami",
];

export default function JoinOurTeam() {
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  // Ensure Turnstile script exists and site key is available
  useEffect(() => {
    // We rely on public/index.html setting window.TURNSTILE_SITE_KEY
    // and loading https://challenges.cloudflare.com/turnstile/v0/api.js
    if (!window.TURNSTILE_SITE_KEY) {
      console.warn("Turnstile site key missing: window.TURNSTILE_SITE_KEY not set");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "working", msg: "Submitting…" });

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Turnstile auto-injects a hidden input named "cf-turnstile-response"
    const tsToken = fd.get("cf-turnstile-response") || "";
    if (!tsToken) {
      setStatus({ type: "error", msg: "Please complete the Turnstile challenge." });
      return;
    }

    // Collect fields
    const payload = {
      name: (fd.get("name") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      city: (fd.get("city") || "").toString().trim().toLowerCase(),
      specialties: (fd.get("specialties") || "").toString().trim(),
      bio: (fd.get("bio") || "").toString().trim(),
      website: (fd.get("website") || "").toString().trim(),
      instagram: (fd.get("instagram") || "").toString().trim(),
      tiktok: (fd.get("tiktok") || "").toString().trim(),
      youtube: (fd.get("youtube") || "").toString().trim(),
      facebook: (fd.get("facebook") || "").toString().trim(),
      linkedin: (fd.get("linkedin") || "").toString().trim(),
      yelp: (fd.get("yelp") || "").toString().trim(),
      opentable: (fd.get("opentable") || "").toString().trim(),
      // send token in body (the API accepts header OR body)
      turnstileToken: tsToken,
    };

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Also pass token via header (API will accept either)
          "cf-turnstile-response": tsToken,
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || `Onboarding failed (${res.status})`);
      }

      setStatus({ type: "ok", msg: "Thanks! We’ll review your application shortly." });
      form.reset();
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong." });
    } finally {
      // Reset Turnstile widget so a fresh token is generated
      try { window.turnstile && window.turnstile.reset(); } catch {}
    }
  }

  return (
    <main className="join-wrap">
      <h1 className="join-title">Join Our Team</h1>
      <p className="join-sub">Apply to be featured as a Chefs2Table chef in your city.</p>

      <form className="join-form" onSubmit={handleSubmit} noValidate>
        <div className="grid">
          <label>
            Full Name
            <input name="name" type="text" required placeholder="Your name" />
          </label>

          <label>
            Email
            <input name="email" type="email" required placeholder="you@example.com" />
          </label>

          <label>
            Phone
            <input name="phone" type="tel" placeholder="(optional)" />
          </label>

          <label>
            City
            <select name="city" required defaultValue="">
              <option value="" disabled>Select your city</option>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
          </label>

          <label className="col-span-2">
            Specialties (comma separated)
            <input name="specialties" type="text" placeholder="Farm-to-table, Seasonal, Vegan" />
          </label>

          <label className="col-span-2">
            Short Bio
            <textarea name="bio" rows="4" placeholder="Tell us about your background and food philosophy…" />
          </label>

          <label>
            Website
            <input name="website" type="url" placeholder="https://…" />
          </label>

          <label>
            Instagram
            <input name="instagram" type="url" placeholder="https://instagram.com/…" />
          </label>

          <label>
            TikTok
            <input name="tiktok" type="url" placeholder="https://tiktok.com/@…" />
          </label>

          <label>
            YouTube
            <input name="youtube" type="url" placeholder="https://youtube.com/@…" />
          </label>

          <label>
            Facebook
            <input name="facebook" type="url" placeholder="https://facebook.com/…" />
          </label>

          <label>
            LinkedIn
            <input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" />
          </label>

          <label>
            Yelp
            <input name="yelp" type="url" placeholder="https://yelp.com/biz/…" />
          </label>

          <label>
            OpenTable
            <input name="opentable" type="url" placeholder="https://opentable.com/…" />
          </label>
        </div>

        {/* Cloudflare Turnstile widget — auto-renders via the script in public/index.html */}
        <div
          className="cf-turnstile"
          data-sitekey={window.TURNSTILE_SITE_KEY || ""}
          data-theme="light"
        />

        <button className="btn gold" type="submit" disabled={status.type === "working"}>
          {status.type === "working" ? "Submitting…" : "Apply"}
        </button>

        {status.type === "ok" && <p className="notice ok">{status.msg}</p>}
        {status.type === "error" && <p className="notice error">{status.msg}</p>}
      </form>
    </main>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */