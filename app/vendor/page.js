"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Vendor.module.css";

export default function VendorSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // ✅ Ensure password is included
    business_name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Error during submission. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1>Vendor Signup</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="business_name"
            placeholder="Business Name"
            value={formData.business_name}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </main>
    </div>
  );
}
