"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/LoginForm.module.css";

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Form state changes dynamically based on vendor/user selection
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only for vendors
    business_name: "", // Only for vendors
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle dropdown change
  const handleRoleChange = (e) => {
    setIsVendor(e.target.value === "vendor");

    // Reset form fields when changing role
    setFormData({
      email: "",
      password: "",
      name: "",
      business_name: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const apiEndpoint = isRegistering ? "/api/register" : "/api/login";
  
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isVendor }), // ✅ Include isVendor
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }
  
      if (!data.user || !data.user.email) {
        return;
      }
  
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data.user._id,
          email: data.user.email,
          role: data.user.role || "user",
          vendorId: data.user.vendorId || null,
        })
      );
  
      router.push("/");
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {isRegistering ? "Register" : "Login"} as {isVendor ? "Vendor" : "User"}
      </h2>

      <form onSubmit={handleSubmit}>
        {isRegistering && isVendor && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name:</label>
              <input
                className={styles.formInput}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Business Name:</label>
              <input
                className={styles.formInput}
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Enter your business name"
                required
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email:</label>
          <input
            className={styles.formInput}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Password:</label>
          <input
            className={styles.formInput}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Login as:</label>
          <select
            className={styles.formInput}
            value={isVendor ? "vendor" : "user"}
            onChange={handleRoleChange}
          >
            <option value="user">User</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      {message && <p className={styles.message}>{message}</p>}

      <p className={styles.toggleText}>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
