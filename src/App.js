import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ChefGrid from "./components/ChefGrid";
import Dashboard from "./components/Dashboard/Dashboard";
import "./styles.css";


export default function App() {
  return (
    <Router>
      {/* Navigation bar visible on all routes */}
      <Nav />

      {/* Route definitions */}
      <Routes>
        {/* Homepage: Hero section + Chef grid */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <ChefGrid />
            </>
          }
        />

        {/* Internal dashboard: temporarily accessible via /dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
