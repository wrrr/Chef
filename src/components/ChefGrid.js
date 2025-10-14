// ===========================
// Import React
// ===========================
import React from "react";
import "./ChefGrid.css";

// ===========================
// Import chef images
// ===========================
import Chef1 from "./chef1.jpg";
import Chef2 from "./chef2.jpg";
import Chef3 from "./chef3.jpg";
import Chef4 from "./chef4.jpg";
import Chef5 from "./chef5.jpg";

// ✅ Corrected: match the actual filename (Chefs.js)
import chefs from "./Chefs";

// ===========================
// ChefGrid component
// ===========================
export default function ChefGrid() {
  return (
    <>
      <div className="chef-heading">Meet Our Chefs</div>

      <section className="chef-grid container chef-section">
        <div className="chef-grid-wrapper">
          {/* Chef 1 */}
          <div className="chef-card">
            <img src={Chef1} alt="Chef Maria" />
            <h3>Chef Maria</h3>
            <p>Farm-to-Table Culinary Expert</p>
          </div>

          {/* Chef 2 */}
          <div className="chef-card">
            <img src={Chef2} alt="Chef Marcus" />
            <h3>Chef Marcus</h3>
            <p>Master of savory delights</p>
          </div>

          {/* Chef 3 */}
          <div className="chef-card">
            <img src={Chef3} alt="Chef Luis" />
            <h3>Chef Luis</h3>
            <p>Gourmet specialist in seasonal dishes</p>
          </div>

          {/* Chef 4 */}
          <div className="chef-card">
            <img src={Chef4} alt="Chef Ana" />
            <h3>Chef Ana</h3>
            <p>Bringing desserts to life</p>
          </div>

          {/* Chef 5 */}
          <div className="chef-card">
            <img src={Chef5} alt="Chef Quinn" />
            <h3>Chef Quinn</h3>
            <p>Expert in artisanal breads & pastries</p>
          </div>
        </div>
      </section>
    </>
  );
}
