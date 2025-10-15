import React from "react";
import aside1 from "../assets/images/aside1.jpg";
import aside2 from "../assets/images/aside2.jpg";
import aside3 from "../assets/images/aside3.jpg";

export default function Aside() {
  const images = [aside1, aside2, aside3];

  return (
    <aside className="aside-section">
      {images.map((img, idx) => (
        <div className="aside-card" key={idx}>
          <img src={img} alt={`Dish ${idx + 1}`} />
        </div>
      ))}
    </aside>
  );
}

