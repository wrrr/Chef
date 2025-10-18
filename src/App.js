// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import GA from "./GA";

// Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import MeetLocalChefs from "./pages/MeetLocalChefs";
import JoinOurTeam from "./pages/JoinOurTeam";
import Dashboard from "./components/Dashboard/Dashboard";
import Contact from "./pages/Contact";
import ChefDemo from "./pages/ChefDemo"; // ✅ demo profile page

// Global styles
import "./styles.css";

export default function App() {
  return (
    <Router>
      <GA />
      <Nav />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Chefs listing (with/without city) */}
          <Route path="/chefs" element={<MeetLocalChefs />} />
          <Route path="/chefs/:city" element={<MeetLocalChefs />} />

          {/* Chef Demo profile (two explicit routes to avoid optional-param quirks) */}
          <Route path="/chef-demo" element={<ChefDemo />} />
          <Route path="/chef-demo/:city" element={<ChefDemo />} />

          <Route path="/join-team" element={<JoinOurTeam />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}