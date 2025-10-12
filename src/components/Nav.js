// ===========================
// Import React & Router
// ===========================
import React from "react";
import { Link } from "react-router-dom";

// ===========================
// Navigation component
// ===========================
export default function Nav() {
  return (
    <nav className="nav container">
      {/* Brand / Logo */}
      <div className="brand">
        <Link to="/">
          {/* Logo image */}
          <img
            src={require("../assets/logo.png")}
            alt="Chefs2Table Logo"
            className="logo"
          />
        </Link>

        {/* Brand text */}
        <div>
          <h1>Chefs2Table</h1>
          <small>Delicious meals, exceptional deals</small>
        </div>
      </div>

      {/* Menu links */}
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/chefs">Chefs</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Dashboard login button */}
        <Link to="/dashboard" className="btn gold">
          Login
        </Link>
      </div>
    </nav>
  );
}
