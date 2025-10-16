import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import logo from "../assets/logo.png";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="site-header">
      {/* Left side: logo + title + tagline */}
      <div className="header-left">
        <img src={logo} alt="Chefs2Table Logo" className="logo" />
        <div className="title-container">
          <h1 className="site-title">Chefs2Table</h1>
          <p className="tagline">Delicious Meals - Exceptional Deals</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-bar">
        <ul className="nav-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li className="nav-dropdown">
            <button>Chefs</button>
            <ul className="dropdown-menu">
              <li>
                <Link to="/chefs">Meet Our Chefs</Link>
                <ul className="submenu">
                  <li>
                    <Link to="/chefs">Toronto</Link>
                  </li>
                  <li>
                    <Link to="/chefs">New York</Link>
                  </li>
                  <li>
                    <Link to="/chefs">Boston</Link>
                  </li>
                  <li>
                    <Link to="/chefs">Chicago</Link>
                  </li>
                  <li>
                    <Link to="/chefs">New Orleans</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* Contact page */}
          <li>
            <Link to="/contact">Contact</Link>
          </li>

          <li>
            <Link to="/dashboard" className="login-button">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}