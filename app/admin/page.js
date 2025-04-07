"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ Read query from URL
import styles from "../../styles/Admin.module.css";
import Navbar from "../../components/Navbar";
import { Trash2, RefreshCcw } from "lucide-react"; // ✅ Import delete icon

export default function Admin() {
  const [books, setBooks] = useState([]);
  // const [orders, setOrders] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search state
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // ✅ Get search query from URL
  const router = useRouter();

  // ✅ Step 1: Get vendorId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const vendorData = JSON.parse(localStorage.getItem("user"));
      if (!vendorData || !vendorData.vendorId) {
        alert("Unauthorized access. Redirecting...");
        router.push("/login"); // Redirect non-vendors
      } else {
        setVendorId(vendorData.vendorId);
      }
    }
  }, []);

  // ✅ Step 2: Fetch books & orders
  const fetchBooks = async () => {
    if (!vendorId) return;

    setLoading(true);
    let queryParam = `?vendorId=${vendorId}`;
    if (query) {
      queryParam += `&query=${encodeURIComponent(query)}`;
    }

    try {
      const res = await fetch(`/api/books${queryParam}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        console.error("Error fetching books");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [vendorId, query]); // ✅ Re-run when vendorId or search query changes

  // ✅ Step 3: Handle Book Deletion
  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    setLoading(true); // ✅ Show loading state

    try {
      const res = await fetch("/api/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId)); // ✅ Update UI instantly
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error: Could not delete book.");
    } finally {
      setLoading(false); // ✅ Hide loading state
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.h1}>Admin Dashboard</h1>

        {vendorId && (
          <section>
            <h2 className={styles.h2}>Your Books</h2>

            {/* ✅ Search & Refresh */}
            <div className={styles.searchWrap}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(
                    `/admin?query=${encodeURIComponent(searchQuery)}`
                  );
                }}
                className={styles.searchForm}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your books..."
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  Search
                </button>
              </form>
              <button
                onClick={fetchBooks}
                className={styles.refreshButton}
                title="Refresh Books"
              >
                <RefreshCcw size={20} />
              </button>
            </div>

            <div className={styles.booksWrapper}>
              <div className={styles.booksGrid}>
                {loading ? (
                  <p>Loading books...</p>
                ) : books.length > 0 ? (
                  books.map((book) => (
                    <div key={book._id} className={styles.bookCard}>
                      <h2>{book.title}</h2>
                      <p>Author: {book.author}</p>
                      <p>Price: ₹{book.price}</p>
                      <p>Rental Fee: ₹{book.rentalFee}/day</p>
                      <p>Security Deposit: ₹{book.securityDeposit}</p>
                      <p>Stock: {book.stock}</p>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(book._id)}
                        disabled={loading} // ✅ Disable button while deleting
                      >
                        <Trash2 size={20} color={loading ? "gray" : "red"} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No books found for your vendor account.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* <section>
          <h2>Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className={styles.order}>
              <p>Book: {order.book.title}</p>
              <p>Type: {order.type}</p>
              <p>Status: {order.status}</p>
              <p>Address: {order.deliveryAddress}</p>
            </div>
          ))}
        </section> */}
      </main>
    </div>
  );
}
