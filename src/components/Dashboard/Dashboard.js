// src/components/Dashboard/Dashboard.js
import React from "react";
import DashboardHeader from "./DashboardHeader";
import OrderWidget from "./OrderWidget";
import RevenueWidget from "./RevenueWidget";
import ChefWidget from "./ChefWidget";

export default function Dashboard() {
  return (
    <section className="dashboard-container container">
      <DashboardHeader />
      <div className="widgets-grid">
        <OrderWidget />
        <ChefWidget />
        <RevenueWidget />
      </div>
    </section>
  );
}
