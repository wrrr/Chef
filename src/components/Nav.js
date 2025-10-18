// src/components/Nav.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";
import logo from "../assets/logo.png";

export default function Nav() {
  const [contactOpen, setContactOpen] = useState(false);
  const { pathname } = useLocation();

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
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">Home</Link>
          </li>

          {/* Chefs: no dropdown, just link to the page with pill menu */}
          <li className={pathname.startsWith("/chefs") ? "active" : ""}>
            <Link to="/chefs">Meet Local Chefs</Link>
          </li>

          {/* Contact dropdown (kept) */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => setContactOpen(true)}
            onMouseLeave={() => setContactOpen(false)}
          >
            <Link to="/contact">Contact</Link>
            <ul
              className="dropdown-menu"
              style={{ display: contactOpen ? "block" : "none" }}
            >
              <li><Link to="/join-team">Join Our Team</Link></li>
            </ul>
          </li>

          <li className={pathname === "/about" ? "active" : ""}>
            <Link to="/about">About</Link>
          </li>

          <li className={pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li className={pathname === "/login" ? "active" : ""}>
            <Link to="/login" className="login-button">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}