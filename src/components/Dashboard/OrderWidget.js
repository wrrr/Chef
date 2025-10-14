import React from "react";
import "./Dashboard.css";

export default function OrderWidget() {
  return (
    <div className="widget">
      <h2 className="widget-title" style={{ color: '#9B1C18' }}>Orders</h2>

      <ul className="widget-list">
        <li>
          John Doe - <span className="status">Pending</span>
        </li>
        <li>
          Jane Smith - <span className="status">Completed</span>
        </li>
      </ul>
    </div>
  );
}
