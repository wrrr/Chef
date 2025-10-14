import React from "react";
import heroImage from "../assets/images/hero1.jpg";
import "./Hero.css";

export default function Hero() {
  return (
    <>
      <section className="hero" id="waitlist">
      <div className="hero-card">
        <span className="tag">From $15 / meal</span>
        <h2 className="hero-title">
          Restaurant Quality Meals from Local Chefs
          <br />
          &nbsp;Delivered Fresh Daily
        </h2>
        <p className="lead">
          Discover chef‑crafted dishes from home cooks, retired pros, and rising culinary artists in your city.
          Daily rotating menus. One click. Fresh to your door.
        </p>
        <div className="trust">
          <span className="chip">100% Money‑Back Guarantee</span>
          <span className="chip">Food‑Safety Verified</span>
          <span className="chip">$0.99 platform fee</span>
        </div>
        <form
          className="hero-form"
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const city = e.target.city.value;
            if (!email || !city) {
              alert("Please enter a valid email and select a city.");
              return;
            }
            alert(`🎉 You’re on the Chefs2Table waitlist, ${email}!`);
            e.target.reset();
          }}
        >
          <input
            className="input"
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            aria-label="Email"
            required
          />
          <select className="select" id="city" name="city" aria-label="City" required>
            <option value="">Select your city</option>
            <option>Toronto</option>
            <option>New York</option>
            <option>Los Angeles</option>
            <option>Vancouver</option>
            <option>Chicago</option>
            <option>Other</option>
          </select>
          <button className="btn gold" type="submit">Join Waitlist</button>
        </form>
      </div>

      <div className="hero-image-wrapper">
        <img
          src={heroImage}
          alt="Delicious meals"
          className="hero-image"
        />
      </div>
    </section>
      <button openLinkInNewTab={false} style={{
        all: "unset",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginTop: "20px",
        appearance: "none",
        backgroundColor: "black",
        color: "white",
        borderRadius: "4px",
        textAlign: "center",
        cursor: "pointer",
        padding: "15px 25px",
      }}>
        Click me!
      </button>
    </>
  );
}
