import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css"; // ✅ Correct relative path
import logo from "../assets/logo.png"; // ✅ Correct logo path

export default function Nav() {
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

          <li className="nav-dropdown">
            <a href="#">Chefs</a>
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
          </li>

          <li className="nav-dropdown">
            <Link to="/contact">Contact</Link>
            <ul className="dropdown-menu">
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