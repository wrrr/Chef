// src/pages/MeetLocalChefs.js
import React, { useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ChefGrid from "../components/ChefGrid";
import "./MeetLocalChefs.css";

const CITY_LIST = [
  { slug: "toronto", label: "Toronto" },
  { slug: "new-york", label: "New York" },
  { slug: "boston", label: "Boston" },
  { slug: "chicago", label: "Chicago" },
  { slug: "new-orleans", label: "New Orleans" },
  { slug: "austin", label: "Austin" },
  { slug: "dallas", label: "Dallas" },
  { slug: "houston", label: "Houston" },
  { slug: "miami", label: "Miami" },
];

function normalizeCityParam(p) {
  if (!p) return "toronto";
  return String(p).trim().toLowerCase().replace(/\s+/g, "-");
}

export default function MeetLocalChefs() {
  const params = useParams();               // /chefs/:city (or /chefs)
  const navigate = useNavigate();

  const activeSlug = useMemo(
    () => normalizeCityParam(params.city || "toronto"),
    [params.city]
  );

  const activeCity =
    CITY_LIST.find((c) => c.slug === activeSlug) || CITY_LIST[0];

  // If someone hits /chefs (no city), normalize URL to default city
  useEffect(() => {
    if (!params.city) {
      navigate(`/chefs/${activeCity.slug}`, { replace: true });
    }
  }, [params.city, navigate, activeCity.slug]);

  return (
    <main className="mlc-wrap">
      {/* Elegant header bar */}
      <section className="city-header-bar" aria-live="polite">
        <div className="city-header-left">
          <span className="city-kicker">City</span>
          <h2 className="city-title">
            {activeCity.label} <span className="city-sub">• Meet Local Chefs</span>
          </h2>
        </div>
      </section>

      {/* Pills */}
      <nav className="city-pills" aria-label="Choose a city" role="tablist">
        {CITY_LIST.map((c) => {
          const active = c.slug === activeSlug;
          return (
            <Link
              key={c.slug}
              to={`/chefs/${c.slug}`}
              role="tab"
              aria-selected={active}
              className={`pill${active ? " active" : ""}`}
            >
              {c.label}
            </Link>
          );
        })}
      </nav>

      {/* Grid */}
      <ChefGrid city={activeSlug} />
    </main>
  );
}