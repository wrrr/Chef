import React from "react";

export default function ChefWidget() {
  const chefs = [
    { id: 1, name: "Chef Mario", active: true },
    { id: 2, name: "Chef Luigi", active: false },
  ];

  return (
    <div className="widget chef-widget">
      <h2>Chefs</h2>
      <ul>
        {chefs.map((c) => (
          <li key={c.id}>
            {c.name} - {c.active ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>
    </div>
  );
}
