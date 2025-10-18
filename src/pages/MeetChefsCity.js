// src/pages/MeetChefsCity.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ChefGrid from "../components/ChefGrid";

const CITIES = [
  { slug: "toronto",     label: "Toronto" },
  { slug: "new-york",    label: "New York" },
  { slug: "boston",      label: "Boston" },
  { slug: "chicago",     label: "Chicago" },
  { slug: "new-orleans", label: "New Orleans" },
];

export default function MeetChefsCity() {
  const { city = "toronto" } = useParams();
  const [chefs, setChefs] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  const [shuffleKey, setShuffleKey] = useState("");

  useEffect(() => {
    // new shuffle key each time city changes (ensures different order)
    setShuffleKey(`${city}-${Date.now()}`);

    let aborted = false;
    setState({ loading: true, error: "" });

    const url = `/api/chefs?city=${encodeURIComponent(city)}&limit=100&shuffle=1`;
    fetch(url, { headers: { Accept: "application/json" } })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (!aborted) {
          setChefs(data.chefs || []);
          setState({ loading: false, error: "" });
        }
      })
      .catch(() => !aborted && setState({ loading: false, error: "Failed to load chefs." }));

    return () => { aborted = true; };
  }, [city]);

  const title = `Meet the Chefs — ${CITIES.find(c => c.slug === city)?.label || city}`;

  return (
    <section className="chef-grid-container" aria-labelledby="meet-chefs-city-title" style={{ paddingTop: 8 }}>
      <h2 id="meet-chefs-city-title" className="chef-grid-title" style={{ color: "#9b1c18" }}>
        {title}
      </h2>

      <nav className="chef-city-nav" aria-label="Choose a city" style={{ margin: "8px 0 16px" }}>
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            to={`/chefs/${c.slug}`}
            className={`chef-city-link ${c.slug === city ? "active" : ""}`}
            style={{ marginRight: 12 }}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      {state.loading && <div className="help-text">Loading chefs…</div>}
      {state.error && <div className="status err" role="alert">{state.error}</div>}
      {!state.loading && !state.error && <ChefGrid chefs={chefs} shuffleKey={shuffleKey} />}
      {!state.loading && !state.error && chefs.length === 0 && (
        <div className="help-text">No chefs approved in this city yet.</div>
      )}
    </section>
  );
}
