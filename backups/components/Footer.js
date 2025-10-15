import React from "react";
import Aside1 from "../assets/images/aside1.jpg";
import Aside2 from "../assets/images/aside2.jpg";
import Aside3 from "../assets/images/aside3.jpg";
import Aside4 from "../assets/images/aside4.jpg";
import Aside5 from "../assets/images/aside5.jpg";
import "./Footer.css";

export default function Footer() {
  const footerImages = [Aside1, Aside2, Aside3, Aside4, Aside5];
  const cities = ["Toronto", "New York", "Boston", "Chicago", "New Orleans"];

  return (
    <footer className="footer-container">
      <div className="footer-images">
        {footerImages.map((img, index) => (
          <img key={index} src={img} alt={`Aside ${index + 1}`} />
        ))}
      </div>

      <div className="footer-copyright">
        &copy; 2025 Chefs2Table.com
      </div>

      <div className="footer-cities">
        {cities.map((city, index) => (
          <span key={index} className="footer-city">{city}</span>
        ))}
      </div>
    </footer>
  );
}