import React from "react";
import DashboardHeader from "./DashboardHeader";
import ChefWidget from "./ChefWidget";
import OrderWidget from "./OrderWidget";
import RevenueWidget from "./RevenueWidget";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardHeader title="Dashboard" />
      <div className="widgets-container">
        <ChefWidget />
        <OrderWidget />
        <RevenueWidget />
      </div>
    </div>
  );
}