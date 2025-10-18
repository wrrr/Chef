// src/components/cities.js

// Canonical list with display name + URL-safe slug
export const CITIES = [
  { name: "Toronto",     slug: "toronto" },
  { name: "New York",    slug: "new-york" },
  { name: "Boston",      slug: "boston" },
  { name: "Chicago",     slug: "chicago" },
  { name: "New Orleans", slug: "new-orleans" },
];

// Legacy export so existing imports don't break
export const cities = CITIES.map(c => c.name);

// Default (first in list)
export const DEFAULT_CITY = CITIES[0].slug;

// Helpers
export function getCityBySlug(slug) {
  if (!slug) return null;
  const s = String(slug).toLowerCase();
  return CITIES.find(c => c.slug === s) || null;
}

export function normalizeCity(input) {
  if (!input) return null;
  const s = String(input).toLowerCase().trim();
  // slug match
  let m = CITIES.find(c => c.slug === s);
  if (m) return m;
  // name match
  m = CITIES.find(c => c.name.toLowerCase() === s);
  if (m) return m;
  // hyphenate name and compare
  m = CITIES.find(c => c.slug === s.replace(/\s+/g, "-"));
  return m || null;
}

export function ensureValidCitySlug(slug) {
  const m = getCityBySlug(slug);
  return m ? m.slug : DEFAULT_CITY;
}