import React from "react";
import "./Dashboard.css";

export default function ChefWidget() {
  return (
    <div className="widget">
      <h2 className="widget-title" style={{ color: '#9B1C18' }}>Chefs</h2>

      <ul className="widget-list">
        <li>Chef Mario - Active</li>
        <li>Chef Luigi - Inactive</li>
      </ul>
    </div>
  );
}
