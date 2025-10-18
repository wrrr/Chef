// src/components/Nav.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import logo from "../assets/logo.png";

// Visible labels for the submenu
const CITY_LABELS = ["Toronto", "New York", "Boston", "Chicago", "New Orleans"];

// Make URL-friendly slugs (e.g., "New York" -> "new-york")
const slugifyCity = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Nav() {
  const [chefsOpen, setChefsOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-left">
        <img src={logo} alt="Chefs2Table logo" className="logo" />
        <div className="title-container">
          <h1 className="site-title">Chefs2Table</h1>
          <p className="tagline">Delicious Meals - Exceptional Deals</p>
        </div>
      </div>

      <nav className="nav-bar" aria-label="Main navigation">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>

          {/* Chefs dropdown */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => setChefsOpen(true)}
            onMouseLeave={() => { setChefsOpen(false); setCitiesOpen(false); }}
          >
            <button aria-haspopup="true" aria-expanded={chefsOpen}>Chefs</button>
            <ul className="dropdown-menu" style={{ display: chefsOpen ? "block" : "none" }}>
              <li
                onMouseEnter={() => setCitiesOpen(true)}
                onMouseLeave={() => setCitiesOpen(false)}
              >
                {/* Parent item; /chefs will redirect to a default city in App.js */}
                <Link to="/chefs">Meet Local Chefs</Link>

                <ul className="submenu" style={{ display: citiesOpen ? "block" : "none" }}>
                  {CITY_LABELS.map((label) => (
                    <li key={label}>
                      <Link to={`/chefs/${slugifyCity(label)}`}>{label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </li>

          {/* Contact dropdown */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => setContactOpen(true)}
            onMouseLeave={() => setContactOpen(false)}
          >
            <Link to="/contact">Contact</Link>
            <ul className="dropdown-menu" style={{ display: contactOpen ? "block" : "none" }}>
              <li><Link to="/join-team">Join Our Team</Link></li>
            </ul>
          </li>

          <li><Link to="/about">About</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/login" className="login-button">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}