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
  const [isEditMode, setIsEditMode] = useState(false);
  const [bookId, setBookId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromQuery = params.get("bookId");
    if (idFromQuery) {
      setBookId(idFromQuery);
      setIsEditMode(true);
    }
  }, []);

  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          const res = await fetch(`/api/books?bookId=${bookId}`);
          const allBooks = await res.json();
          const book = allBooks.find((b) => b._id === bookId);

          if (book) {
            setNewBook({
              title: book.title,
              author: book.author,
              price: book.price,
              rentalFee: book.rentalFee,
              securityDeposit: book.securityDeposit,
              stock: book.stock,
            });
          }
        } catch (err) {
          alert("Failed to fetch book data");
        }
      };

      fetchBook();
    }
  }, [bookId]);

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
  useEffect(() => {
    const calculatedPrice = newBook.rentalFee + newBook.securityDeposit;
    if (!isNaN(calculatedPrice)) {
      setNewBook((prev) => ({
        ...prev,
        price: calculatedPrice,
      }));
    }
  }, [newBook.rentalFee, newBook.securityDeposit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert("Vendor ID is missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch("/api/books", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBook,
          ...(isEditMode ? { bookId } : { vendorId }),
        }),
      });

      if (!res.ok) {
        throw new Error(
          isEditMode ? "Failed to update book" : "Failed to add book"
        );
      }

      alert(
        isEditMode ? "Book updated successfully!" : "Book added successfully!"
      );

      if (!isEditMode) {
        setNewBook({
          title: "",
          author: "",
          price: 0,
          rentalFee: 0,
          securityDeposit: 0,
          stock: 0,
        });
      } else {
        router.push("/admin"); // or wherever the book list is
      }
    } catch (error) {
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <section>
          <h1 className={styles.h1}>{isEditMode ? "Edit Book" : "Add Book"}</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formInputWrap}>
              <label>
                Title <span className={styles.mandatory}>*</span>
              </label>
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
              <label>
                Author <span className={styles.mandatory}>*</span>
              </label>
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
              <label>
                Stock <span className={styles.mandatory}>*</span>
              </label>
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
            <div className={styles.formInputWrap}>
              <label>
                Rental Fee (/day) <span className={styles.mandatory}>*</span>
              </label>
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
              <label>
                Security Amount <span className={styles.mandatory}>*</span>
              </label>
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
              <label>
                Price <span className={styles.mandatory}>*</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                value={newBook.price}
                readOnly
              />
              <small className={styles.helperText}>
                (Price = Rental Fee + Security)
              </small>
            </div>

            <button type="submit" className={styles.addBook}>
              {isEditMode ? "Update Book" : "Add Book"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
