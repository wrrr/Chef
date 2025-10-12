// src/pages/ChefOnboarding.js
import React, { useState } from "react";
import "./ChefOnboarding.css"; // we’ll create this CSS for styling

export default function ChefOnboarding() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: connect to

.chef-onboarding {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.chef-form input,
.chef-form button {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.chef-form button {
  background: #d89a2b;
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.chef-form button:hover {
  filter: brightness(1.05);
}
