"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // ✅ Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ✅ Go to books page without search
  const goToBooksPage = () => {
    router.push("/books?query="); // Go to books page without query
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

          {/* ✅ Button to go to Books Page */}
          <button onClick={goToBooksPage} className={styles.viewBooksButton}>
            View All Books
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
