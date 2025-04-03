"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import styles from "../../styles/Admin.module.css";

export default function AddBookForm() {
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

  // ✅ Get vendorId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.vendorId) {
        setVendorId(userData.vendorId);
      } else {
        alert("Vendor ID is missing. Please log in again.");
        router.push("/login"); // Redirect to login if vendorId is missing
      }
    }
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert("Vendor ID is missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBook, vendorId }),
      });

      if (!res.ok) {
        throw new Error("Failed to add book");
      }

      alert("Book added successfully!");
      setNewBook({
        title: "",
        author: "",
        price: 0,
        rentalFee: 0,
        securityDeposit: 0,
        stock: 0,
      });
    } catch (error) {
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <section>
          <h1 className={styles.h1}>Add Book</h1>
          <form onSubmit={handleAddBook} className={styles.form}>
            <div className={styles.formInputWrap}>
              <label>Title</label>
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formInputWrap}>
              <label>Author</label>
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formInputWrap}>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({ ...newBook, price: +e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formInputWrap}>
              <label>Rental Fee (/day)</label>
              <input
                type="number"
                placeholder="Rental Fee (/day)"
                value={newBook.rentalFee}
                onChange={(e) =>
                  setNewBook({ ...newBook, rentalFee: +e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formInputWrap}>
              <label>Security Amount</label>
              <input
                type="number"
                placeholder="Security Amount"
                value={newBook.securityDeposit}
                onChange={(e) =>
                  setNewBook({ ...newBook, securityDeposit: +e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formInputWrap}>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={newBook.stock}
                onChange={(e) =>
                  setNewBook({ ...newBook, stock: +e.target.value })
                }
                required
              />
            </div>
              <button type="submit">Add Book</button>
          </form>
        </section>
      </main>
    </div>
  );
}
