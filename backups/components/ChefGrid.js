import React from "react";
import Chef1 from "../assets/images/chefs/chef1.jpg";
import Chef2 from "../assets/images/chefs/chef2.jpg";
import Chef3 from "../assets/images/chefs/chef3.jpg";
import Chef4 from "../assets/images/chefs/chef4.jpg";
import Chef5 from "../assets/images/chefs/chef5.jpg";
import "./ChefGrid.css";

const chefs = [
  { name: "Chef Maria", specialty: "Farm-to-Table Culinary Expert", image: Chef1 },
  { name: "Chef Marcus", specialty: "Master of Savory Delights", image: Chef2 },
  { name: "Chef Luis", specialty: "Gourmet Specialist in Seasonal Dishes", image: Chef3 },
  { name: "Chef Ana", specialty: "Bringing Desserts to Life", image: Chef4 },
  { name: "Chef Quinn", specialty: "Expert in Artisanal Breads & Pastries", image: Chef5 },
];

export default function ChefGrid() {
  const firstRow = chefs.slice(0, 3);
  const secondRow = chefs.slice(3);

  return (
    <section className="chef-grid-container">
      <h2 className="chef-grid-title">Meet Our Chefs</h2>

      <div className="chef-grid">
        {firstRow.map((chef) => (
          <div key={chef.name} className="chef-card">
            <img src={chef.image} alt={chef.name} className="chef-image" />
            <h3 className="chef-name">{chef.name}</h3>
            <p className="chef-specialty">{chef.specialty}</p>
          </div>
        ))}
      </div>

      {secondRow.length > 0 && (
        <div className="chef-grid second-row">
          {secondRow.map((chef) => (
            <div key={chef.name} className="chef-card">
              <img src={chef.image} alt={chef.name} className="chef-image" />
              <h3 className="chef-name">{chef.name}</h3>
              <p className="chef-specialty">{chef.specialty}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}