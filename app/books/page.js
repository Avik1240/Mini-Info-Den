"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅ Read query from URL
import Navbar from "../../components/Navbar";
import styles from "../../styles/Books.module.css";
import { RefreshCcw} from "lucide-react"; // ✅ Import delete icon
export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search state
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // ✅ Get search query from URL

  const fetchBooks = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Construct query parameters
    let queryParam = user?.vendorId ? `?vendorId=${user.vendorId}` : "";
    if (query) {
      queryParam += queryParam
        ? `&query=${encodeURIComponent(query)}`
        : `?query=${encodeURIComponent(query)}`;
    }

    try {
      const res = await fetch(`/api/books${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        console.error("Error fetching books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [query]); // ✅ Re-fetch when search query changes

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1>Books</h1>
        <div className={styles.searchWrap}>
          {/* ✅ Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/books?query=${encodeURIComponent(
                searchQuery
              )}`;
            }}
            className={styles.searchForm}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
          <button onClick={fetchBooks} className={styles.refreshButton}>
          <RefreshCcw size={20} />
          </button>
        </div>

        <div className={styles.booksWrapper}>
          {loading ? (
            <p>Loading...</p>
          ) : books.length > 0 ? (
            <div className={styles.bookList}>
              {books.map((book) => (
                <div key={book._id} className={styles.viewbookCard}>
                  <h2>{book.title}</h2>
                  <p>Author: {book.author}</p>
                  <p>Price: ₹{book.price}</p>
                  <p>Rental Fee: ₹{book.rentalFee}</p>
                  <p>Security Deposit: ₹{book.securityDeposit}</p>
                  <p>Books in stock: {book.stock}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No books found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
