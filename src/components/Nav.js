import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css"; 
import logo from "../assets/logo.png";

export default function Nav() {
  const [chefsDropdownOpen, setChefsDropdownOpen] = useState(false);

  const toggleChefsDropdown = () => {
    setChefsDropdownOpen(!chefsDropdownOpen);
  };

  return (
    <nav className="site-header">
      <div className="header-left">
        <img src={logo} alt="Chefs2Table Logo" className="logo" />
        <div className="title-container">
          <h1 className="site-title">Chefs2Table</h1>
          <p className="tagline">Delicious Meals - Exceptional Deals</p>
        </div>
      </div>

      <ul className="nav-bar nav-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>

        <li className="nav-dropdown" onMouseEnter={() => setChefsDropdownOpen(true)} onMouseLeave={() => setChefsDropdownOpen(false)}>
          <button onClick={toggleChefsDropdown}>
            Chefs ▼
          </button>
          {chefsDropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/chefs">Meet Local Chefs</Link>
                <ul className="submenu">
                  <li><Link to="/chefs">Toronto</Link></li>
                  <li><Link to="/chefs">New York</Link></li>
                  <li><Link to="/chefs">Boston</Link></li>
                  <li><Link to="/chefs">Chicago</Link></li>
                  <li><Link to="/chefs">New Orleans</Link></li>
                </ul>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/dashboard" className="login-button">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
}