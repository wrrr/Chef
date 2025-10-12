import React from 'react';

export default function KPICards({ totalOrders, activeChefs, revenue }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
      <div style={{ flex: 1, padding: '1rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <h2>{totalOrders}</h2>
        <p>Total Orders</p>
      </div>
      <div style={{ flex: 1, padding: '1rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <h2>{activeChefs}</h2>
        <p>Active Chefs</p>
      </div>
      <div style={{ flex: 1, padding: '1rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <h2>${revenue}</h2>
        <p>Total Revenue</p>
      </div>
    </div>
  );
}
