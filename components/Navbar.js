"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // for user dropdown
  const [navOpen, setNavOpen] = useState(false); // for mobile menu
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

  const handleLogout = async () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      }).catch((error) =>
        console.error("Failed to clear cart on logout:", error)
      );
    }

    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Info Den</Link>
      </div>

      {/* Hamburger Icon */}
      <button
        className={styles.hamburger}
        onClick={() => setNavOpen((prev) => !prev)}
      >
        ☰
      </button>

      <div
        className={`${styles.navLinks} ${navOpen ? styles.navOpen : ""}`}
        onClick={() => setNavOpen(false)} // close menu when link clicked
      >
        <Link href="/">Home</Link>

        {user?.vendorId && <Link href="/admin">Admin</Link>}

        {user && !user.vendorId && (
          <>
            <Link href="/cart" className={styles.cartLink}>
              Cart
            </Link>
            <Link href="/orders" className={styles.cartLink}>
              Your Orders
            </Link>
          </>
        )}

        {user ? (
          <div className={styles.dropdown}>
            <button
              className={styles.userButton}
              onClick={(e) => {
                e.stopPropagation(); // prevent navClose
                setIsOpen(!isOpen);
              }}
            >
              Hi{" "}
              {user?.email?.includes("@") ? user.email.split("@")[0] : "User"}
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
