// src/pages/ChefDemo.js
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import "./ChefDemo.css";

import PlaceholderChef from "../assets/images/placeholders/chef2table_placeholder.png";

// Demo dish images (food): chefs 6..10
import DishImg1 from "../assets/images/chefs/chef6.jpg";
import DishImg2 from "../assets/images/chefs/chef7.jpg";
import DishImg3 from "../assets/images/chefs/chef8.jpg";
import DishImg4 from "../assets/images/chefs/chef9.jpg";
import DishImg5 from "../assets/images/chefs/chef10.jpg";

const DEMO_DISH_IMAGES = [DishImg1, DishImg2, DishImg3, DishImg4, DishImg5];

function pickRandom(arr) { return Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }
function stripQuotes(s) { return typeof s === "string" ? s.replace(/^["']|["']$/g, "") : s; }
function firstNonEmpty(...vals) { for (const v of vals) { if (v != null && String(v).trim() !== "") return v; } return null; }

function normalizeSpecialties(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map(stripQuotes).filter(Boolean);
  if (typeof value === "string") {
    const s = value.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed.map(stripQuotes).filter(Boolean) : [stripQuotes(s)];
      } catch {}
    }
    if (s.includes(",")) return s.split(",").map((t) => stripQuotes(t.trim())).filter(Boolean);
    return [stripQuotes(s)];
  }
  return [];
}

function buildDemoDishes(chefName = "Local Chef", city = "your city") {
  const names = ["Signature Plate","Seasonal Special","Chef’s Favorite","Market Bowl","Tasting Dish"];
  const descs = [
    `A showcase from ${chefName}, highlighting peak flavors in ${city}.`,
    "Balanced, bright, and satisfying—crafted fresh daily.",
    "Comfort with a modern twist, prepared with care.",
    "Locally sourced ingredients, simply done right.",
    "A playful composition of textures and aromas."
  ];
  const prices = [1299,1499,1599,1799,1999];

  return DEMO_DISH_IMAGES.map((img, i) => ({
    id: `demo-${i + 1}`,
    name: names[i % names.length],
    description: descs[i % descs.length],
    price_cents: prices[i % prices.length],
    image_url: img
  }));
}

export default function ChefDemo() {
  const { city: cityParam } = useParams();
  const city = (cityParam || "toronto").toLowerCase();

  // Read prefill from the URL so the clicked card's identity is preserved.
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const idParam   = params.get("id");
  const nameParam = params.get("name");
  const photoParam= params.get("photo");
  const specsParam= params.get("specialties");

  const prefillChef = useMemo(() => {
    if (idParam || nameParam || photoParam || specsParam) {
      return {
        id: idParam || undefined,
        name: nameParam || undefined,
        photo_url: photoParam || undefined,
        specialties: specsParam || undefined,
        city,
        status: "approved",
      };
    }
    return null;
  }, [idParam, nameParam, photoParam, specsParam, city]);

  const [chef, setChef] = useState(prefillChef);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dishLoading, setDishLoading] = useState(true);
  const [hardError, setHardError] = useState(null); // only show for 5xx or network failures

  // Load/resolve the chef. Gracefully handle 4xx (e.g., 400) by falling back to prefill/demo.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setHardError(null);

    (async () => {
      try {
        const res = await fetch(`/api/chefs?city=${encodeURIComponent(city)}&limit=100`, {
          headers: { accept: "application/json" },
        });

        let list = [];
        if (res.ok) {
          const json = await res.json();
          list = Array.isArray(json?.chefs) ? json.chefs : [];
        } else {
          // Swallow 4xx (like 400) silently; only flag 5xx as a hard error.
          console.warn(`Chefs API returned ${res.status}`);
          if (res.status >= 500) setHardError(`Chefs API ${res.status}`);
          list = [];
        }

        const approved = list.filter((c) => (c.status || "approved") === "approved");
        let chosen = null;

        if (idParam) {
          chosen = (approved.length ? approved : list).find((c) => String(c.id) === String(idParam)) || null;
        }
        if (!chosen) chosen = prefillChef || pickRandom(approved.length ? approved : list);

        if (!cancelled) setChef(chosen || prefillChef || null);
      } catch (e) {
        console.warn("Chefs API fetch failed", e);
        if (!cancelled) {
          setChef(prefillChef || null);
          setHardError("Chefs API unavailable");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [city, idParam, prefillChef]);

  // Load dishes for the chosen chef; fallback to demo dishes (food photos 6..10).
  useEffect(() => {
    let cancelled = false;

    // If no real ID (local/demo card), just show demo dishes.
    if (!chef?.id) {
      setDishes(buildDemoDishes(chef?.name || "Local Chef", city));
      setDishLoading(false);
      return;
    }

    setDishLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/dishes?city=${encodeURIComponent(city)}&limit=100`, {
          headers: { accept: "application/json" },
        });

        let items = [];
        if (res.ok) {
          const json = await res.json();
          items = Array.isArray(json?.dishes) ? json.dishes : [];
        } else {
          console.warn(`Dishes API returned ${res.status}`);
          // Fall back to demo; only flag hard error for 5xx.
          if (res.status >= 500) setHardError((prev) => prev || `Dishes API ${res.status}`);
          items = [];
        }

        let filtered = items.filter((d) => (d.chef_id || d.chefId) === chef.id);
        if (!filtered.length) filtered = buildDemoDishes(chef?.name || "Local Chef", city);
        if (!cancelled) setDishes(filtered.slice(0, 6));
      } catch (e) {
        console.warn("Dishes API fetch failed", e);
        if (!cancelled) setDishes(buildDemoDishes(chef?.name || "Local Chef", city));
      } finally {
        if (!cancelled) setDishLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [chef, city]);

  const specialties = useMemo(() => normalizeSpecialties(chef?.specialties), [chef]);

  const chefPhoto = firstNonEmpty(chef?.photo_url, chef?.photo, PlaceholderChef);
  const chefName  = firstNonEmpty(chef?.name, "Local Chef");
  const chefCity  = firstNonEmpty(chef?.city, city);
  const bio       = firstNonEmpty(chef?.bio, "This chef is currently onboarding. More details coming soon!");

  return (
    <main className="chef-demo">
      <div className="chef-breadcrumb">
        <Link to={`/chefs/${encodeURIComponent(chefCity)}`} className="crumb">
          &larr; Back to {chefCity.charAt(0).toUpperCase() + chefCity.slice(1)} chefs
        </Link>
      </div>

      <section className="chef-hero">
        <div className="chef-photo-wrap">
          <img src={chefPhoto} alt={chefName} className="chef-photo" />
        </div>
        <div className="chef-meta">
          <h1 className="chef-name">{chefName}</h1>
          <div className="chef-city">Based in <strong>{chefCity.charAt(0).toUpperCase() + chefCity.slice(1)}</strong></div>

          {specialties.length > 0 && (
            <div className="pills">
              {specialties.map((s, i) => <span className="pill" key={`${s}-${i}`}>{s}</span>)}
            </div>
          )}

          <p className="chef-bio">{bio}</p>

          <div className="chef-socials">
            {chef?.website   && <a href={chef.website}   target="_blank" rel="noreferrer">Website</a>}
            {chef?.instagram && <a href={chef.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {chef?.tiktok    && <a href={chef.tiktok}    target="_blank" rel="noreferrer">TikTok</a>}
            {chef?.youtube   && <a href={chef.youtube}   target="_blank" rel="noreferrer">YouTube</a>}
            {chef?.facebook  && <a href={chef.facebook}  target="_blank" rel="noreferrer">Facebook</a>}
            {chef?.linkedin  && <a href={chef.linkedin}  target="_blank" rel="noreferrer">LinkedIn</a>}
            {chef?.yelp      && <a href={chef.yelp}      target="_blank" rel="noreferrer">Yelp</a>}
            {chef?.opentable && <a href={chef.opentable} target="_blank" rel="noreferrer">OpenTable</a>}
          </div>
        </div>
      </section>

      <section className="dish-section">
        <div className="dish-header">
          <h2>Signature Dishes</h2>
          {!dishLoading && dishes.length === 0 && <p className="muted">Dishes will appear here once this chef completes onboarding.</p>}
        </div>

        <div className="dish-grid">
          {(dishLoading ? Array.from({ length: 3 }) : dishes).map((d, i) => {
            const title = d?.name || "Coming Soon";
            const desc  = d?.description || "This dish will be revealed soon. Stay tuned!";
            const price = d?.price_cents != null ? `$${(d.price_cents / 100).toFixed(2)}` : "";
            const img   = firstNonEmpty(d?.image_url, d?.image?.url, d?.primary_image_url, PlaceholderChef);

            return (
              <div key={d?.id || i} className="dish-card">
                <div className="dish-photo-wrap"><img src={img} alt={title} className="dish-photo" /></div>
                <div className="dish-meta">
                  <div className="dish-title-row">
                    <h3 className="dish-title">{title}</h3>
                    {price && <span className="dish-price">{price}</span>}
                  </div>
                  <p className="dish-desc">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Only show a visible error for hard failures (5xx / network) */}
      {hardError && <div className="error">Error: {hardError}</div>}
    </main>
  );
}