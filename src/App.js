import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import MeetLocalChefs from "./pages/MeetLocalChefs";
import JoinOurTeam from "./pages/JoinOurTeam";
import Dashboard from "./components/Dashboard/Dashboard";

// Global styles
import "./styles.css";

// Favicon import
import favicon from "./assets/favicon.png";

export default function App() {
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href={favicon} />
      </Helmet>

      <Router>
        {/* Navigation bar visible on all routes */}
        <Nav />

        {/* Main page container with horizontal gutter */}
        <div className="page-container">
          <Routes>
            {/* Homepage: Hero section + Chef grid */}
            <Route path="/" element={<Home />} />

            {/* About page */}
            <Route path="/about" element={<AboutPage />} />

            {/* Chefs-related pages */}
            <Route path="/chefs" element={<MeetLocalChefs />} />
            <Route path="/join-team" element={<JoinOurTeam />} />

            {/* Internal dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Footer visible on all routes */}
        <Footer />
      </Router>
    </>
  );
}