import React, { useState } from "react";
import "./Home.css"; // Or your global styles

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cities = ["Toronto", "New York", "Boston", "Chicago", "New Orleans"];

  return (
    <section className="email-section">
      <label htmlFor="email">Enter your email:</label>
      <input type="email" id="email" placeholder="you@example.com" />

      <div
        className="city-dropdown"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button className="dropdown-button">
          {selectedCity || "Select your city"}
        </button>
        {dropdownOpen && (
          <ul className="dropdown-menu">
            {cities.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}