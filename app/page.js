"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorId, setVendorId] = useState(null);
  const router = useRouter();

  // ✅ Check if logged-in user is a vendor
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.vendorId) { // ✅ Check vendorId safely
        setVendorId(userData.vendorId);
      }
    }
  }, []);



  // ✅ Handle "View All Books" or "Add Book" button click
  const handleButtonClick = () => {
    router.push(vendorId ? "/addBook" : "/books");
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.welcome}>
          <h1>Welcome to Info Den</h1>

          <button onClick={handleButtonClick} className={styles.viewBooksButton}>
            {vendorId ? "Add Book" : "View All Books"}
          </button>
        </section>

        <section className={styles.features}>
          <h2>Why Info Den?</h2>
          <ul>
            <li>Rent books for 1-30 days</li>
            <li>Buy your favorites</li>
            <li>Fast delivery by our agents</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
