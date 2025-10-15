import React from "react";

// ===============================================
// Dashboard Component
// Placeholder for Operations Control Panel
// ===============================================

export default function Dashboard() {
  return (
    <section style={{ padding: "2rem" }}>
      <h2>Operations Dashboard</h2>
      <p>
        This is a placeholder for the business operations control panel.
        You can add stats, order processing, and other widgets here.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Orders</h3>
          <p>0</p>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Active Chefs</h3>
          <p>0</p>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Revenue</h3>
          <p>$0.00</p>
        </div>
      </div>
    </section>
  );
}
