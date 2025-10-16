import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact-page container">
      <h2 className="contact-title">Contact Us</h2>

      <p className="contact-description">
        Have questions or want to get in touch? Fill out the form below and we’ll respond as soon as possible.
      </p>

      <form className="contact-form">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your Name" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>

        <button type="submit" className="contact-submit">Send Message</button>
      </form>
    </section>
  );
}