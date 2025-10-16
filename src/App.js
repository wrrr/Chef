import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import GA from "./GA"; // 👈 new GA component

// Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import MeetLocalChefs from "./pages/MeetLocalChefs";
import JoinOurTeam from "./pages/JoinOurTeam";
import Dashboard from "./components/Dashboard/Dashboard";
import Contact from "./pages/Contact";

// Global styles
import "./styles.css";

export default function App() {
  return (
    <Router>
      {/* Google Analytics tracking */}
      <GA />

      {/* Navigation bar visible on all routes */}
      <Nav />

      {/* Main page container with horizontal gutter */}
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/chefs" element={<MeetLocalChefs />} />
          <Route path="/join-team" element={<JoinOurTeam />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      {/* Footer visible on all routes */}
      <Footer />
    </Router>
  );
}