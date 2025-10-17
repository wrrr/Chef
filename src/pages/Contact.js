import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch("/sendContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent!");
        e.target.reset();
      } else {
        const text = await res.text();
        setStatus(`Failed to send message: ${text}`);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setStatus("Error sending message.");
    }
  };

  return (
    <section className="contact-page container">
      <h2 className="contact-title">Contact Us</h2>
      <p className="contact-description">
        Have questions or want to get in touch? Fill out the form below and we’ll respond as soon as possible.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your Name" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>

        <button type="submit" className="contact-submit">Send Message</button>
        <p>{status}</p>
      </form>
    </section>
  );
}