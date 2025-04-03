"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Books.module.css";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.vendorId) {
      console.error("Vendor ID not found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/books?vendorId=${user.vendorId}`);
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
  }, []);

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1>My Books</h1>
        <button onClick={fetchBooks} className={styles.refreshButton}>
          🔄 Refresh Books
        </button>
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
