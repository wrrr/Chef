import React from "react";

export default function RevenueWidget() {
  const revenue = 3240; // placeholder

  return (
    <div className="widget revenue-widget">
      <h2>Revenue</h2>
      <p>${revenue.toLocaleString()}</p>
    </div>
  );
}
