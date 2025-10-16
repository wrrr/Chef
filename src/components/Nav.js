import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css"; // ✅ Correct relative path
import logo from "../assets/logo.png"; // ✅ Correct logo path

export default function Nav() {
  const [chefsOpen, setChefsOpen] = useState(false);

  const toggleChefs = () => setChefsOpen((prev) => !prev);

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

          <li
            className={`nav-dropdown ${chefsOpen ? "open" : ""}`}
            onMouseLeave={() => setChefsOpen(false)}
          >
            <button onClick={toggleChefs} aria-haspopup="true" aria-expanded={chefsOpen}>
              Chefs
            </button>

            <ul
              className="dropdown-menu"
              style={{ display: chefsOpen ? "block" : "none" }}
            >
              <li>
                <Link to="/chefs" onClick={() => setChefsOpen(false)}>Meet Local Chefs</Link>
                <ul className="submenu">
                  <li><Link to="/chefs" onClick={() => setChefsOpen(false)}>Toronto</Link></li>
                  <li><Link to="/chefs" onClick={() => setChefsOpen(false)}>New York</Link></li>
                  <li><Link to="/chefs" onClick={() => setChefsOpen(false)}>Boston</Link></li>
                  <li><Link to="/chefs" onClick={() => setChefsOpen(false)}>Chicago</Link></li>
                  <li><Link to="/chefs" onClick={() => setChefsOpen(false)}>New Orleans</Link></li>
                </ul>
              </li>
              <li><Link to="/join-team" onClick={() => setChefsOpen(false)}>Join Our Team</Link></li>
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