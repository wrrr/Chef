// src/pages/JoinOurTeam.js
import React, { useEffect, useRef, useState } from "react";
import "./JoinOurTeam.css";

const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || "";

/** Load Turnstile script exactly once and resolve when window.turnstile is ready */
function loadTurnstile() {
  return new Promise((resolve, reject) => {
    if (window.turnstile?.render) return resolve();

    const existing = document.getElementById("cf-turnstile-script");
    if (existing) {
      const t = Date.now();
      const poll = () => {
        if (window.turnstile?.render) return resolve();
        if (Date.now() - t > 8000) return reject(new Error("Turnstile timed out"));
        setTimeout(poll, 60);
      };
      return poll();
    }

    const s = document.createElement("script");
    s.id = "cf-turnstile-script";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(s);
  });
}

export default function JoinOurTeam() {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tsReady, setTsReady] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);

  const formRef = useRef(null);
  const mountRef = useRef(null);
  const widgetRef = useRef(null);
  const unmounted = useRef(false);

  // Load Turnstile script on first mount
  useEffect(() => {
    unmounted.current = false;
    (async () => {
      try {
        if (!SITE_KEY) {
          setTsReady(false);
          return;
        }
        await loadTurnstile();
        if (!unmounted.current) setTsReady(true);
      } catch (e) {
        if (!unmounted.current) {
          setError(e.message || "Captcha failed to initialize.");
          setTsReady(false);
        }
      }
    })();

    return () => {
      unmounted.current = true;
      try {
        if (widgetRef.current && window.turnstile?.remove) {
          window.turnstile.remove(widgetRef.current);
        }
      } catch {}
      widgetRef.current = null;
      setWidgetReady(false);
    };
  }, []);

  // Render (or re-render) the widget when script is ready
  useEffect(() => {
    if (!tsReady || !mountRef.current) return;
    try {
      if (widgetRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetRef.current);
      }
      widgetRef.current = window.turnstile.render(mountRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        size: "normal",
        callback: (tok) => setToken(tok || ""),
        "error-callback": () => setToken(""),
        "expired-callback": () => setToken(""),
        appearance: "always",
      });
      setWidgetReady(true);
    } catch (e) {
      setError("Could not render captcha widget.");
      setWidgetReady(false);
    }
  }, [tsReady]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setOk(false);
    setError("");

    try {
      const fd = new FormData(formRef.current);
      const data = Object.fromEntries(fd.entries());

      const specialties = String(data.specialties || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: data.name?.trim(),
        city: data.city?.trim().toLowerCase(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        website: data.website?.trim(),
        photo_url: data.photo_url?.trim(),
        bio: data.bio?.trim(),
        linkedin: data.linkedin?.trim(),
        instagram: data.instagram?.trim(),
        tiktok: data.tiktok?.trim(),
        youtube: data.youtube?.trim(),
        facebook: data.facebook?.trim(),
        yelp: data.yelp?.trim(),
        opentable: data.opentable?.trim(),
        specialties,
        turnstile_token: token,
      };

      if (!payload.name || !payload.city || !payload.email) {
        throw new Error("Please fill in name, city, and email.");
      }
      if (!SITE_KEY) throw new Error("Captcha is not configured.");
      if (!token) throw new Error("Please complete the captcha.");

      const res = await fetch("/api/chefs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Registration failed.");

      setOk(true);
      formRef.current?.reset();
      setToken("");
      try {
        if (window.turnstile && widgetRef.current) {
          window.turnstile.reset(widgetRef.current);
        }
      } catch {}
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="join-wrap">
      <h1 className="join-title">Join Our Chef Community</h1>
      <p className="join-lead">
        Apply below to become a Chefs2Table partner. We’ll review your profile and get back to you quickly.
      </p>

      {ok && <div className="alert ok">Thanks! Your profile has been submitted for review.</div>}
      {error && <div className="alert err">Error: {error}</div>}

      <form ref={formRef} className="join-form" onSubmit={onSubmit} noValidate>
        <fieldset className="grid two">
          <label>
            <span>Name *</span>
            <input name="name" type="text" placeholder="Chef Jane Doe" required />
          </label>
          <label>
            <span>City *</span>
            <select name="city" required defaultValue="">
              <option value="" disabled>Select city</option>
              {["toronto","new-york","boston","chicago","new-orleans","austin","dallas","houston","miami"].map((slug) => {
                const label = slug.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase());
                return <option key={slug} value={slug}>{label}</option>;
              })}
            </select>
          </label>

          <label>
            <span>Email *</span>
            <input name="email" type="email" placeholder="you@chef.com" required />
          </label>
          <label>
            <span>Phone</span>
            <input name="phone" type="tel" placeholder="+1 555 555 5555" />
          </label>
        </fieldset>

        <fieldset className="grid two">
          <label className="col-span-2">
            <span>Short Bio</span>
            <textarea name="bio" rows="4" placeholder="Tell diners about your experience, cuisines, and story..." />
          </label>

          <label>
            <span>Specialties (comma-separated)</span>
            <input name="specialties" type="text" placeholder="Farm-to-table, Seasonal, Desserts" />
          </label>
          <label>
            <span>Website</span>
            <input name="website" type="url" placeholder="https://your-site.com" />
          </label>
          <label>
            <span>Photo URL</span>
            <input name="photo_url" type="url" placeholder="https://images.example/your-photo.jpg" />
          </label>
        </fieldset>

        <fieldset className="grid three">
          <label>
            <span>Instagram</span>
            <input name="instagram" type="url" placeholder="https://instagram.com/yourhandle" />
          </label>
          <label>
            <span>TikTok</span>
            <input name="tiktok" type="url" placeholder="https://tiktok.com/@yourhandle" />
          </label>
          <label>
            <span>YouTube</span>
            <input name="youtube" type="url" placeholder="https://youtube.com/@yourchannel" />
          </label>
          <label>
            <span>Facebook</span>
            <input name="facebook" type="url" placeholder="https://facebook.com/yourpage" />
          </label>
          <label>
            <span>LinkedIn</span>
            <input name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" />
          </label>
          <label>
            <span>Yelp</span>
            <input name="yelp" type="url" placeholder="https://yelp.com/biz/your-biz" />
          </label>
          <label className="col-span-3">
            <span>OpenTable</span>
            <input name="opentable" type="url" placeholder="https://opentable.com/r/your-restaurant" />
          </label>
        </fieldset>

        <div className="captcha-row">
          {SITE_KEY ? (
            <>
              {!tsReady && <div className="alert">Loading verification…</div>}
              <div ref={mountRef} id="turnstile-mount" />
              {!widgetReady && tsReady && <div className="muted" style={{ marginTop: 6 }}>Preparing widget…</div>}
            </>
          ) : (
            <div className="alert err">Captcha not configured.</div>
          )}
        </div>

        <div className="actions">
          <button className="btn gold" type="submit" disabled={submitting || !token || !widgetReady}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </main>
  );
}