// API utility functions for fetching dashboard data

// Example: fetch orders from backend
export async function fetchOrders() {
  try {
    const res = await fetch('/api/orders'); // replace with real endpoint
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.error('fetchOrders error:', err);
    return [];
  }
}

// Example: fetch chefs list
export async function fetchChefs() {
  try {
    const res = await fetch('/api/chefs'); // replace with real endpoint
    if (!res.ok) throw new Error('Failed to fetch chefs');
    return await res.json();
  } catch (err) {
    console.error('fetchChefs error:', err);
    return [];
  }
}
