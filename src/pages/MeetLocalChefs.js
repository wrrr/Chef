// src/pages/MeetLocalChefs.js
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ChefGrid from "../components/ChefGrid";
import { CITIES as MAIN_CITIES } from "../components/cities";

// Extra cities you liked in the old horizontal menu
const EXTRA_CITIES = [
  { name: "Austin",  slug: "austin"  },
  { name: "Dallas",  slug: "dallas"  },
  { name: "Houston", slug: "houston" },
  { name: "Miami",   slug: "miami"   },
  { name: "New York City", slug: "new-york" }, // route stays /chefs/new-york
];

const prettyCity = (slug) =>
  (slug || "")
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

export default function MeetLocalChefs() {
  const { city: cityParam } = useParams();
  const activeSlug = (cityParam || "").toLowerCase() || "toronto";

  // Merge main + extra cities (dedup by slug)
  const ALL_CITIES = useMemo(() => {
    const bySlug = new Map();
    [...MAIN_CITIES, ...EXTRA_CITIES].forEach((c) => bySlug.set(c.slug, c));
    return Array.from(bySlug.values());
  }, []);

  return (
    <section className="chef-grid-container">
      {/* Horizontal city pills */}
      <nav className="city-pills" aria-label="Cities">
        {ALL_CITIES.map((c) => (
          <Link
            key={c.slug}
            className={`pill ${activeSlug === c.slug ? "active" : ""}`}
            to={`/chefs/${c.slug}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <h2 className="chef-grid-title" style={{ color: "#9b1c18" }}>
        Meet Local Chefs — {prettyCity(activeSlug)}
      </h2>

      {/* Key forces re-mount -> fresh shuffle & animation per city */}
      <ChefGrid key={activeSlug} city={activeSlug} />
    </section>
  );
}