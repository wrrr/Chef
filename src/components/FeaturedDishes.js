// src/components/FeaturedDishes.js
import React, { useEffect, useMemo, useState } from "react";
import "./FeaturedDishes.css";

// Optional: pass your brand placeholder if you want
import BrandPlaceholder from "../assets/images/placeholders/chef2table_placeholder.png";

function formatPrice(cents, currency = "USD") {
  if (typeof cents !== "number") return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

export default function FeaturedDishes({
  city,
  limit = 4,
  title = "Featured Dishes",
}) {
  const [state, setState] = useState({ loading: true, error: "", data: [] });

  const url = useMemo(() => {
    const u = new URL("/api/dishes", window.location.origin);
    if (city) u.searchParams.set("city", String(city).toLowerCase());
    u.searchParams.set("limit", String(limit));
    return u.toString();
  }, [city, limit]);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: "" }));

    fetch(url, { headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        if (!alive) return;
        setState({ loading: false, error: "", data: j?.dishes || [] });
      })
      .catch((err) => {
        if (!alive) return;
        setState({ loading: false, error: err.message || "Failed to load", data: [] });
      });

    return () => {
      alive = false;
    };
  }, [url]);

  const { loading, error, data } = state;

  if (!city) return null;

  return (
    <section className="fd-container">
      <h2 className="fd-title">{title}</h2>

      {loading && (
        <div className="fd-grid">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={`s-${i}`} className="fd-card fd-skeleton">
              <div className="fd-photo" />
              <div className="fd-lines">
                <div className="fd-line" />
                <div className="fd-line short" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="fd-error">Couldn’t load dishes: {error}</div>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="fd-empty">No dishes yet for this city — check back soon!</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="fd-grid">
          {data.map((d) => {
            const img = d.image?.url || BrandPlaceholder;
            const price = formatPrice(d.price_cents, d.currency);
            const categories =
              Array.isArray(d.categories) ? d.categories.join(", ") : "";
            return (
              <article key={d.id} className="fd-card" tabIndex={0}>
                <img
                  className="fd-photo"
                  src={img}
                  alt={d.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="fd-meta">
                  <div className="fd-row">
                    <h3 className="fd-name">{d.name}</h3>
                    {price && <span className="fd-price">{price}</span>}
                  </div>
                  {categories && (
                    <p className="fd-cats">{categories}</p>
                  )}
                  {d.chef?.name && (
                    <p className="fd-chef">By {d.chef.name}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}