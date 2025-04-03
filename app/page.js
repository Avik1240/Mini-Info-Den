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
      if (userData && "vendorId" in userData && userData.vendorId) { // ✅ Explicitly check vendorId presence
        setVendorId(userData.vendorId);
      } else {
        setVendorId(null); // ✅ Set to null for normal users
      }
    }
  }, []);
  
  

  // ✅ Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ✅ Handle "View All Books" or "Add Book" button click
  const handleButtonClick = () => {
    if (vendorId) {
      router.push("/addBook"); // ✅ Vendors go to AddBook page
    } else {
      router.push("/books"); // ✅ Normal users go to the books page
    }
  };
  

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.welcome}>
          <h1>Welcome to Info Den</h1>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a book..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>

          {/* ✅ Conditional Button */}
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
