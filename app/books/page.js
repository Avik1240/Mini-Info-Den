"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Books.module.css";
import { RefreshCcw } from "lucide-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (err) {
        console.error("Invalid cart:", err);
      }
    }
  }, []);

  // ✅ Load user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user:", err);
      }
    }
  }, []);

  // ✅ Get quantity of book in cart
  const getBookQuantity = (bookId) => {
    const item = cart.find((item) => item.bookId === bookId);
    return item?.quantity || 0;
  };

  // ✅ Sync updated cart with MongoDB
  const syncCartToDB = async (updatedCart) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    try {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email, // ✅ use email if your API expects it
          cart: updatedCart.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        }),
      });
    } catch (err) {
      console.error("Error syncing cart to MongoDB:", err);
    }
  };

  // ✅ Add/remove item in cart and sync state + DB
  const updateCart = (book, quantityChange) => {
    let existingCart = [...cart];
    const bookId = book._id || book.bookId;

    const index = existingCart.findIndex((item) => item.bookId === bookId);

    if (index !== -1) {
      existingCart[index].quantity += quantityChange;

      if (existingCart[index].quantity <= 0) {
        existingCart.splice(index, 1);
      }
    } else if (quantityChange > 0) {
      existingCart.push({
        bookId: bookId,
        quantity: quantityChange,
        vendorId: book.vendorId,
      });
    }

    setCart(existingCart);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // ✅ Send clean data to backend
    syncCartToDB(existingCart);
  };

  // ✅ Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

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
  }, [query]);

  return (
    <div className={styles.mainWrapper}>
      <Navbar />
      <main className={styles.main}>
        <h1>Books</h1>
        <div className={styles.searchWrap}>
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
          <div className={styles.addButtonWrap}>
            <button onClick={fetchBooks} className={styles.refreshButton}>
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

        <div className={styles.booksWrapper}>
          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : books.length > 0 ? (
            <div className={styles.bookList}>
              {books.map((book) => (
                <div key={book._id} className={styles.viewbookCard}>
                  <h2 className={styles.title}>{book.title}</h2>
                  <p>Author: {book.author}</p>
                  <p>Price: ₹{book.price}</p>
                  <p>Rental Fee: ₹{book.rentalFee}</p>
                  <p>Security Deposit: ₹{book.securityDeposit}</p>
                  <p>Books in stock: {book.stock}</p>

                  {user &&
                    !user.vendorId &&
                    (getBookQuantity(book._id) === 0 ? (
                      <button
                        className={styles.cartButton}
                        onClick={() => updateCart(book, 1)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className={styles.counterWrap}>
                        <button onClick={() => updateCart(book, -1)}>-</button>
                        <span>{getBookQuantity(book._id)}</span>
                        <button onClick={() => updateCart(book, 1)}>+</button>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.loading}>!!! No books found !!!</p>
          )}
        </div>
      </main>
    </div>
  );
}
