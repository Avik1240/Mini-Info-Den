"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/Cart.module.css";
import Navbar from "../../components/Navbar";

export default function CartPage() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // 🔄 Fetch cart from MongoDB
  const fetchUserCart = async (userId) => {
    try {
      const res = await fetch(`/api/cart/get?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
        localStorage.setItem("cart", JSON.stringify(data.cart));
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // ✅ Load user and fetch cart
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchUserCart(parsedUser._id);
      } catch (err) {
        console.error("Invalid user:", err);
      }
    }
  }, []);

  // 🛒 Update cart (local + MongoDB)
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
          cart: updatedCart.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        }),
      });
    } catch (err) {
      console.error("Error syncing cart to MongoDB:", err);
    }
  };
  
  const updateCart = (book, quantityChange) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.bookId === book.bookId || item.bookId === book._id
          ? { ...item, quantity: item.quantity + quantityChange }
          : item
      );
  
      // Remove if quantity is 0
      const finalCart = updatedCart.filter(item => item.quantity > 0);
  
      localStorage.setItem("cart", JSON.stringify(finalCart));
  
      return finalCart;
    });
  };
  
  // ✅ Sync to DB whenever `cart` changes
  useEffect(() => {
    if (cart.length > 0) {
      syncCartToDB(cart);
    }
  }, [cart]);
  
  
  



  return (
    <div>
      <Navbar />
      <div className={styles.cartContainer}>
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className={styles.cartList}>
            {cart.map((book) => (
              <div key={book._id} className={styles.cartItem}>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Price: ₹{book.price}</p>
                <p>Rental Fee: ₹{book.rentalFee}</p>
                <p>Security Deposit: ₹{book.securityDeposit}</p>

                {/* Counter */}
                <div className={styles.counterWrap}>
                  <button onClick={() => updateCart(book, -1)}>-</button>
                  <span>{book.quantity}</span>
                  <button onClick={() => updateCart(book, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
