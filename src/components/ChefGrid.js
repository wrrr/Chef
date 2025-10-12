// ===========================
// Import React
// ===========================
import React from "react";

// ===========================
// Import chef images
// (use the same filenames that actually exist in /components folder)
// ===========================
import Chef1 from "./chef1.jpg";
import Chef2 from "./chef2.jpg";
import Chef3 from "./chef3.jpg";
import Chef4 from "./chef4.jpg";
import Chef5 from "./chef5.jpg";

// ===========================
// ChefGrid component
// ===========================
export default function ChefGrid() {
  return (
    <section className="chef-grid container">
      {/* Grid heading */}
      <h2>Meet Our Chefs</h2>

      {/* Chef card grid */}
      <div className="chef-grid-wrapper">
        {/* Chef 1 */}
        <div className="chef-card">
          <img src={Chef1} alt="Chef Maria" />
          <h3>Chef Maria</h3>
          <p>Delicious meals, exceptional deals</p>
        </div>

        {/* Chef 2 */}
        <div className="chef-card">
          <img src={Chef2} alt="Chef Marcus" />
          <h3>Chef Marcus</h3>
          <p>Delicious meals, exceptional deals</p>
        </div>

        {/* Chef 3 */}
        <div className="chef-card">
          <img src={Chef3} alt="Chef Luis" />
          <h3>Chef Luis</h3>
          <p>Delicious meals, exceptional deals</p>
        </div>

        {/* Chef 4 */}
        <div className="chef-card">
          <img src={Chef4} alt="Chef Ana" />
          <h3>Chef Ana</h3>
          <p>Delicious meals, exceptional deals</p>
        </div>

        {/* Chef 5 */}
        <div className="chef-card">
          <img src={Chef5} alt="Chef Carlos" />
          <h3>Chef Carlos</h3>
          <p>Delicious meals, exceptional deals</p>
        </div>
      </div>
    </section>
  );
}
