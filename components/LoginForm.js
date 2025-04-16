"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/LoginForm.module.css";

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [message, setMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false); // ✅ New State
  const [loading, setLoading] = useState(false); // ✅ Track API calls
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

  // Handle Login/Register Submission
  // Handle Login/Register Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiEndpoint = isRegistering ? "/api/register" : "/api/login";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isVendor }),
      });

      const data = await response.json();

      if (!response.ok || !data.user || !data.user.email) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      const userObject = {
        _id: data.user._id,
        email: data.user.email,
        role: data.user.role || "user",
        ...(data.user.vendorId ? { vendorId: data.user.vendorId } : {}),
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(userObject));

      // ✅ Fire session validation and cart fetch in parallel
      const [sessionRes, cartRes] = await Promise.all([
        fetch("/api/session/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userObject._id,
            role: userObject.role,
            loginTime: userObject.loginTime,
          }),
        }),
        fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userObject._id }),
        }),
      ]);

      const sessionData = await sessionRes.json();
      const cartData = await cartRes.json();

      if (!sessionData.valid) {
        localStorage.removeItem("user");
        setMessage("Session invalid. Please login again.");
        return;
      }

      if (cartRes.ok && cartData.cart) {
        localStorage.setItem("cart", JSON.stringify(cartData.cart));
      }

      // 🚀 Redirect instantly
      router.push("/");
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submission
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error sending reset email.");
        return;
      }

      setMessage("Reset link sent to your email.");
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {isRegistering
            ? "Register"
            : forgotPassword
            ? "Forgot Password"
            : "Login"}{" "}
          as {isVendor ? "Vendor" : "User"}
        </h2>

        {!forgotPassword ? (
          <form onSubmit={handleSubmit}>
            {isRegistering && isVendor && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Name: <span className={styles.mandatory}>*</span>
                  </label>
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
                  <label className={styles.formLabel}>
                    Business Name: <span className={styles.mandatory}>*</span>
                  </label>
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
              <label className={styles.formLabel}>
                Email: <span className={styles.mandatory}>*</span>
              </label>
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
              <label className={styles.formLabel}>
                Password: <span className={styles.mandatory}>*</span>
              </label>
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
              <label className={styles.formLabel}>
                Login as: <span className={styles.mandatory}>*</span>
              </label>
              <select
                className={styles.formInput}
                value={isVendor ? "vendor" : "user"}
                onChange={handleRoleChange}
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
            </button>

            {!isRegistering && (
              <p
                className={styles.forgotPassword}
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </p>
            )}
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Enter Your Email: <span className={styles.mandatory}>*</span>
              </label>
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p
              className={styles.forgotPassword}
              onClick={() => setForgotPassword(false)}
            >
              Back to Login
            </p>
          </form>
        )}

        {message && <p className={styles.message}>{message}</p>}

        {!forgotPassword && (
          <p className={styles.toggleText}>
            {isRegistering ? "Already have an account?" : "New User?"}
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
