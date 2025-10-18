// src/components/cities.js

// Simple string list (used by Hero.js)
export const CITY_NAMES = [
  "Toronto",
  "New York",
  "Boston",
  "Chicago",
  "New Orleans",
  "Austin",
  "Dallas",
  "Houston",
  "Miami"
];

// Canonical object list (used by chefs pages)
export const CITIES = CITY_NAMES.map((name) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
}));

export const DEFAULT_CITY = "toronto";

// Back-compat: Hero imports { cities } as strings
export const cities = CITY_NAMES;

// Default export can stay the object list
export default CITIES;