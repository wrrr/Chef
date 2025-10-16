import React, { useState } from "react";
import { cities } from "../data/cities";
import "../styles/Home.css";  // Make sure Home.css exists or adjust to your CSS file

export default function EmailSignup() {
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <div className="email-signup">
      <input type="email" placeholder="Enter your email" />
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Select your city</option>
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <button type="submit">Sign Up</button>
    </div>
  );
}