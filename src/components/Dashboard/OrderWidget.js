import React from "react";

export default function OrderWidget() {
  // placeholder data
  const orders = [
    { id: 1, name: "John Doe", status: "Pending" },
    { id: 2, name: "Jane Smith", status: "Completed" },
  ];

  return (
    <div className="widget order-widget">
      <h2>Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.name} - <strong>{o.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
