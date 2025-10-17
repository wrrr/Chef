// src/pages/Contact.js
import React, { useState } from "react";
import "./Contact.css"; // ✅ reference to /src/pages/Contact.css

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/sendContact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setStatus("error");
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              rows="5"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="contact-button"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status === "success" && (
          <p className="success-message">✅ Message sent successfully!</p>
        )}
        {status === "error" && (
          <p className="error-message">❌ Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
