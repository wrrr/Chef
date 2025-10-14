import React from "react";
import "./Dashboard.css";

export default function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title" style={{ color: '#9B1C18' }}>
        <span className="accent">🍳 Chefs2Table Operations</span>
      </h1>

      <div className="dashboard-subtext">Internal control panel - not visible to public</div>
    </header>
  );
}
