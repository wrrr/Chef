import React from "react";
import DashboardHeader from "./DashboardHeader";
import OrderWidget from "./OrderWidget";
import ChefWidget from "./ChefWidget";
import RevenueWidget from "./RevenueWidget";
import "./Dashboard.css"; // we’ll create a minimal CSS

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="widgets-grid">
        <OrderWidget />
        <ChefWidget />
        <RevenueWidget />
      </div>
    </div>
  );
}
