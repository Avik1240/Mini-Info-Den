"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorId, setVendorId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return router.push("/login");
  
      const user = JSON.parse(storedUser);
  
      try {
        // Fetch server start time
        const serverRes = await fetch("/api/session/server-time");
        const serverData = await serverRes.json();
  
        if (!serverRes.ok) throw new Error("Failed to fetch server time");
  
        if (new Date(user.loginTime) < new Date(serverData.serverStartTime)) {
          localStorage.removeItem("user");
          return router.push("/login");
        }
  
        setVendorId(user.vendorId || null);
      } catch (error) {
        console.error("Session validation failed:", error);
        localStorage.removeItem("user");
        router.push("/login");
      }
    };
  
    validateSession();
  }, []);
  
  

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
