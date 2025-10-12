// ===========================
// Import React
// ===========================
import React from "react";

// ===========================
// Import chef images (actual filenames in your assets folder)
// ===========================
import Chef1Img from "../components/chef1.jpg";
import Chef2Img from "../components/chef2.jpg";
import Chef3Img from "../components/chef3.jpg";
import Chef4Img from "../components/chef4.jpg";
import Chef5Img from "../components/chef5.jpg";

// ===========================
// Chef data array
// ===========================
const chefs = [
  { name: "Maria", image: Chef1Img, description: "Delicious meals, exceptional deals" },
  { name: "Marcus", image: Chef2Img, description: "Delicious meals, exceptional deals" },
  { name: "Luis", image: Chef3Img, description: "Delicious meals, exceptional deals" },
  { name: "Ana", image: Chef4Img, description: "Delicious meals, exceptional deals" },
  { name: "Tom", image: Chef5Img, description: "Delicious meals, exceptional deals" }, // Example
];

// ===========================
// ChefGrid component
// ===========================
export default function ChefGrid() {
  return (
    <section className="chef-grid container">
      {/* Grid heading */}
      <h2>Meet Our Chefs</h2>

      {/* Chef cards container */}
      <div className="grid">
        {chefs.map((chef, index) => (
          <div key={index} className="chef-card">
            {/* Chef image */}
            <img src={chef.image} alt={chef.name} />

            {/* Chef name */}
            <h3>{chef.name}</h3>

            {/* Chef description */}
            <p>{chef.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
