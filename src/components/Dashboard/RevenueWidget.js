import React from "react";
import "./Dashboard.css";

export default function RevenueWidget() {
  return (
    <div className="widget">
      <h2 className="widget-title" style={{ color: '#9B1C18' }}>Revenue</h2>
      <p className="widget-subtle">$ 3,240</p>
    </div>
  );
}
