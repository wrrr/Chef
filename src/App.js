import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// SPA Google Analytics listener
function GAListener() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-TF32R5B1DF", {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
}

export default function App() {
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/png" href={favicon} />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TF32R5B1DF"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TF32R5B1DF');
          `}
        </script>
      </Helmet>

      <Router>
        {/* Tracks SPA pageviews */}
        <GAListener />

        {/* Navigation bar */}
        <Nav />

        {/* Main content container */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/chefs" element={<MeetLocalChefs />} />
            <Route path="/join-team" element={<JoinOurTeam />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </Router>
    </>
  );
}