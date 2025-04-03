"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Info Den</Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/">Home</Link>

        {/* ✅ Show Admin Link Only for Vendors */}
        {user?.vendorId && <Link href="/admin">Admin</Link>}

        {user ? (
          <div className={styles.dropdown}>
            <button
              className={styles.userButton}
              onClick={() => setIsOpen(!isOpen)}
            >
              Hi! {user?.email?.includes("@") ? user.email.split("@")[0] : "User"}
            </button>
            {isOpen && (
              <div className={styles.dropdownContent}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
