import React from "react";
import logo from "../assets/logo.png";
import "./Header.css"; // styling specific to the header

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-left">
        <img src={logo} alt="Chefs2Table Logo" className="logo" />
        <div className="title-container">
          <h1 className="site-title">Chefs2Table</h1>
          <p className="tagline">Delicious Meals - Exceptional Deals</p>
        </div>
      </div>
    </header>
  );
}