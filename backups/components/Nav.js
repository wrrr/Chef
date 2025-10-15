import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import logo from '../assets/logo.png';

export default function Nav() {
  const [chefsDropdownOpen, setChefsDropdownOpen] = useState(false);

  const toggleChefsDropdown = () => {
    setChefsDropdownOpen(!chefsDropdownOpen);
  };

  return (
    <header className="site-header">
      <div className="header-left">
        <img src={logo} alt="Chefs2Table Logo" className="logo" />
        <div className="title-container">
          <h1 className="site-title">Chefs2Table</h1>
          <p className="tagline">Delicious Meals - Exceptional Deals</p>
        </div>
      </div>

      <nav className="nav-bar">
        <ul className="nav-list">
          <li className="nav-dropdown">
            <button onClick={toggleChefsDropdown}>Chefs ▼</button>
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
              <li>
                <Link to="/join-team">Join Our Team</Link>
              </li>
            </ul>
          </li>
          <li><Link to="/dashboard" className="login-button">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}