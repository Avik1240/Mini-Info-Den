"use client";

import { useEffect, useState } from "react";
import styles from "../../styles/Admin.module.css";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: 0,
    rentalFee: 0,
    securityDeposit: 0,
    stock: 0,
  });

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const vendorData = JSON.parse(localStorage.getItem("user"));
      if (vendorData?.vendorId) {
        setVendorId(vendorData.vendorId);
      } else {
        alert("Vendor ID is missing. Please log in again.");
      }
    }
  }, []);

  // ✅ Fetch books after vendorId is set
  useEffect(() => {
    if (vendorId) {
      fetch("/api/books?query=")
        .then((res) => res.json())
        .then(setBooks);
    }
    fetch("/api/orders/all")
      .then((res) => res.json())
      .then(setOrders);
  }, [vendorId]); // ✅ Fetch books only when vendorId is available

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert("Vendor ID is missing. Please log in again.");
      return;
    }

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newBook, vendorId }),
    });

    if (res.ok) {
      alert("Book added successfully! 🎉");

      // ✅ Fetch updated books list from API
      fetch("/api/books?query=")
        .then((res) => res.json())
        .then(setBooks);

      // ✅ Reset the form after adding the book
      setNewBook({
        title: "",
        author: "",
        price: 0,
        rentalFee: 0,
        securityDeposit: 0,
        stock: 0,
      });
    } else {
      const errorData = await res.json();
      alert(errorData.message);
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.h1}>Admin Dashboard</h1>

        <section>
          <h2 className={styles.h2}>Add Book</h2>
          <form onSubmit={handleAddBook} className={styles.form}>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={newBook.price}
              onChange={(e) =>
                setNewBook({ ...newBook, price: +e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Rental Fee (/day)"
              value={newBook.rentalFee}
              onChange={(e) =>
                setNewBook({ ...newBook, rentalFee: +e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Security Deposit"
              value={newBook.securityDeposit}
              onChange={(e) =>
                setNewBook({ ...newBook, securityDeposit: +e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              value={newBook.stock}
              onChange={(e) =>
                setNewBook({ ...newBook, stock: +e.target.value })
              }
            />
            <button type="submit">Add Book</button>
          </form>
        </section>

        {/* ✅ Show books only if vendor is logged in */}
        {vendorId && (
          <section>
            <h2 className={styles.h2}>Your Books</h2>
            <div className={styles.booksWrapper}>
              <div className={styles.booksGrid}>
                {books
                  .filter((book) => book.vendor?._id === vendorId) // ✅ Corrected filtering
                  .map((book) => (
                    <div key={book._id} className={styles.bookCard}>
                      <h3>{book.title}</h3>
                      <p>Author: {book.author}</p>
                      <p>Price: ${book.price}</p>
                      <p>Rental Fee: ${book.rentalFee}/day</p>
                      <p>Security Deposit: ${book.securityDeposit}</p>
                      <p>Stock: {book.stock}</p>
                    </div>
                  ))}
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
