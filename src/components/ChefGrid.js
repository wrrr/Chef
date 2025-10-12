// ===========================
// Import React
// ===========================
import React from "react";

// ===========================
// Import chef images (in the same folder as this file)
// ===========================
import Chef1 from "./chef1.jpg";
import Chef2 from "./chef2.jpg";
import Chef3 from "./chef3.jpg";
import Chef4 from "./chef4.jpg";
import Chef5 from "./chef5.jpg"; // optional if you have a fifth chef

// ===========================
// ChefGrid component
// ===========================
export default function ChefGrid() {
  return (
    <section className="chef-grid">
      {/* Grid heading */}
      <h2>Meet Our Chefs</h2>

      {/* Chef cards container */}
      <div className="chef-cards">
        {/* Chef 1 */}
        <div className="chef-card">
          <img src={Chef1} alt="Chef 1" />
          <h3>Maria</h3>
          <p>Delicious meals, exceptional deals</p>
        </div>

        {/* Chef 2 */}
        <div className="chef-card">
          <img src={Chef2} alt="Chef 2" />
          <h3>Marcus</h3>
          <p>Master of savory delights</p>
        </div>

        {/* Chef 3 */}
        <div className="chef-card">
          <img src={Chef3} alt="Chef 3" />
          <h3>Luis</h3>
          <p>Specialist in gourmet creations</p>
        </div>

        {/* Chef 4 */}
        <div className="chef-card">
          <img src={Chef4} alt="Chef 4" />
          <h3>Ana</h3>
          <p>Bringing desserts to life</p>
        </div>

        {/* Optional Chef 5 */}
        {/* <div className="chef-card">
          <img src={Chef5} alt="Chef 5" />
          <h3>Chef 5 Name</h3>
          <p>Description here</p>
        </div> */}
      </div>

      {/* ===========================
          CSS Styles (inline for reference)
          You can move this to your CSS file if preferred
          =========================== */}
      <style jsx>{`
        .chef-grid {
          padding: 60px 20px;
          text-align: center;
          background-color: #fff;
        }

        .chef-grid h2 {
          font-size: 2rem;
          margin-bottom: 40px;
        }

        .chef-cards {
          display: flex;            /* row layout */
          flex-wrap: wrap;          /* wrap on smaller screens */
          justify-content: center;  /* center the row */
          gap: 20px;                /* spacing between cards */
        }

        .chef-card {
          flex: 1 1 200px;          /* flexible width with min 200px */
          text-align: center;
          border: 1px solid #eee;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .chef-card:hover {
          transform: translateY(-5px);
        }

        .chef-card img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 15px;
        }

        .chef-card h3 {
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .chef-card p {
          font-size: 0.95rem;
          color: #555;
        }

        @media (max-width: 600px) {
          .chef-card {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </section>
  );
}