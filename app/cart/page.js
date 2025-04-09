"use client";
import { useEffect, useState } from "react";
import styles from "../../styles/Cart.module.css";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);
  const [gst, setGst] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);

  // 💡 Recalculate totals when cart updates
  useEffect(() => {
    if (!cart || cart.length === 0) {
      setTotalPrice(0);
      setGst(0);
      setFinalAmount(0);
      setTotalBooks(0);
      return;
    }

    let total = 0;
    let bookCount = 0;

    cart.forEach((item) => {
      total += (item.price || 0) * (item.quantity || 1);
      bookCount += item.quantity || 1;
    });

    const calculatedGst = total * 0.18;
    const grandTotal = total + calculatedGst;

    setTotalPrice(total);
    setGst(calculatedGst);
    setFinalAmount(grandTotal);
    setTotalBooks(bookCount);
  }, [cart]);

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
    const cartClearedFlag = localStorage.getItem("cartCleared");
  
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
  
        if (cartClearedFlag === "true") {
          setCart([]);
          localStorage.removeItem("cart");
          localStorage.removeItem("cartCleared");
        } else {
          fetchUserCart(parsedUser._id);
        }
      } catch (err) {
        console.error("Invalid user:", err);
      }
    }
  }, []);
  
  
  

  // 🛒 Update cart (local + MongoDB)
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

  // ✅ Sync to DB whenever `cart` changes
  useEffect(() => {
    if (cart.length > 0) {
      syncCartToDB(cart);
    }
  }, [cart]);

  const handleButtonClick = () => {
    router.push("/books");
  };

  return (
    <div>
      <Navbar />
      <div className={styles.cartContainer}>
        {cart.length === 0 ? (
          <div className={styles.cartEmpty}>
            <h1>Feels so Light !!</h1>
            <p>Your cart is empty.</p>
            <p className={styles.cartExplore}>
              Explore to grab the knowledge .....
            </p>
            <button
              onClick={handleButtonClick}
              className={styles.viewBooksButton}
            >
              View Books
            </button>
          </div>
        ) : (
          <div>
            <h1>Your Cart</h1>
            <div className={styles.cartWrap}>
              <div className={styles.cartList}>
                {cart.map((book) => (
                  <div key={book._id} className={styles.cartItem}>
                    <h2 className={styles.title}>{book.title}</h2>
                    <p>Author: {book.author}</p>
                    <p>Price: ₹{book.price}</p>
                    <p>Rental Fee: ₹{book.rentalFee}</p>
                    <p>Security Deposit: ₹{book.securityDeposit}</p>

                    {/* Counter */}
                    <div className={styles.counterWrap}>
                      <button
                        onClick={() => updateCart(book, -1)}
                        title="Remove Book"
                      >
                        -
                      </button>
                      <span>{book.quantity}</span>
                      <button
                        onClick={() => updateCart(book, 1)}
                        title="Add Book"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.summaryBox}>
                <h3>Cart Summary</h3>
                <div>
                  <p>
                    Total Books: <span>{totalBooks}</span>
                  </p>
                  <p>
                    Total Price: <span>₹ {totalPrice.toFixed(2)}</span>
                  </p>
                  <p>
                    GST (18%): <span>₹ {gst.toFixed(2)}</span>
                  </p>
                  <p>
                    Final Amount: <span>₹ {finalAmount.toFixed(2)}</span>
                  </p>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className={styles.buyNowButton}
                  title="Buy Now"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
