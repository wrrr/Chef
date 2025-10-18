// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import GA from "./GA";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import MeetLocalChefs from "./pages/MeetLocalChefs";
import JoinOurTeam from "./pages/JoinOurTeam";
import Dashboard from "./components/Dashboard/Dashboard";
import Contact from "./pages/Contact";

import "./styles.css";

const DEFAULT_CITY = "toronto"; // change if you want another default

export default function App() {
  return (
    <Router>
      <GA />
      <Nav />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />

          {/* redirect /chefs -> /chefs/<default> */}
          <Route path="/chefs" element={<Navigate to={`/chefs/${DEFAULT_CITY}`} replace />} />
          {/* city-slugged route */}
          <Route path="/chefs/:city" element={<MeetLocalChefs />} />

          <Route path="/join-team" element={<JoinOurTeam />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />

          {/* optional catch-all */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}