// ===========================
// chefs.js — central data file for all chefs
// Location: src/components/chefs.js
// ===========================

// Import images from the same folder as this file
import Chef1 from "./chef1.jpg";
import Chef2 from "./chef2.jpg";
import Chef3 from "./chef3.jpg";
import Chef4 from "./chef4.jpg";
import Chef5 from "./chef5.jpg";

// Exported array: each object matches the exact text you specified.
// Fields:
// - name: primary name (used as the main heading)
// - duplicateName: second line that should match the name (you requested the name twice)
// - description: the one-line bio you specified
// - image: imported image reference
const chefs = [
  {
    name: "Maria",
    duplicateName: "Maria",
    description: "Farm-to-Table Culinary Expert",
    image: Chef1,
  },
  {
    name: "Marcus",
    duplicateName: "Marcus",
    description: "Master of savory delights",
    image: Chef2,
  },
  {
    name: "Luis",
    duplicateName: "Luis",
    description: "Gourmet specialist in seasonal dishes",
    image: Chef3,
  },
  {
    name: "Ana",
    duplicateName: "Ana",
    description: "Bringing desserts to life",
    image: Chef4,
  },
  {
    name: "Quinn",
    duplicateName: "Quinn",
    description: "Expert in artisanal breads & pastries",
    image: Chef5,
  },
];

export default chefs;