"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Admin.module.css";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Trash2 } from "lucide-react"; // ✅ Import delete icon

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
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
  useEffect(() => {
    if (vendorId) {
      fetch(`/api/books?vendorId=${vendorId}`) // ✅ Fetch vendor-specific books
        .then((res) => res.json())
        .then((data) => setBooks(data))
        .catch((err) => console.error("Error fetching books:", err));
    }

    fetch("/api/orders/all")
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error("Error fetching orders:", err));
  }, [vendorId]); // ✅ Re-run when vendorId changes

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
            <div className={styles.booksWrapper}>
              <div className={styles.booksGrid}>
                {books.length > 0 ? (
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

        <section>
          <h2>Orders</h2>
          {orders.map((order) => (
            <div key={order._id} className={styles.order}>
              <p>Book: {order.book.title}</p>
              <p>Type: {order.type}</p>
              <p>Status: {order.status}</p>
              <p>Address: {order.deliveryAddress}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
