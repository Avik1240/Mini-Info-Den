"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Cart.module.css";
import Navbar from "../../components/Navbar";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedUser = localStorage.getItem("user");
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += (item.price || 0) * (item.quantity || 1);
    });
    const gstAmount = subtotal * 0.18;
    const grandTotal = subtotal + gstAmount;

    setTotal(subtotal);
    setGst(gstAmount);
    setFinalAmount(grandTotal);
  }, [cart]);

  const placeOrder = async () => {
    if (!user) {
      alert("Please login to place order.");
      return;
    }

    try {
      const res = await fetch("/api/orders/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          email: user.email,
          items: cart.map(({ bookId, _id, quantity }) => ({
            bookId: bookId || _id,
            quantity,
          })),
          totalAmount: finalAmount,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // ✅ Clear local cart immediately
        localStorage.removeItem("cart");
        localStorage.setItem("cartCleared", "true");

        // ✅ Clear MongoDB cart
        const clearRes = await fetch("/api/cart/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });

        if (!clearRes.ok) {
          console.warn("Failed to clear cart in DB");
          const errorData = await clearRes.json();
          alert("Cart not cleared in DB: " + errorData.message);
        }
        

        // ✅ Redirect to thank you page
        router.push(`/thankyou?orderId=${data.orderId}`);
      } else {
        console.error("Order failed");
      }
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.cartContainer}>
        <h1>Checkout</h1>
        <div className={styles.cartWrap}>
          <div className={styles.cartList}>
            {cart.map((item, i) => (
              <div key={i} className={styles.cartItem}>
                <h2 className={styles.title}>{item.title}</h2>
                <p>Author: {item.author}</p>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
          <div className={styles.summaryBox}>
            <h3>Order Summary</h3>
            <p>Total Price: ₹{total.toFixed(2)}</p>
            <p>GST (18%): ₹{gst.toFixed(2)}</p>
            <p>
              <strong>Final Amount: ₹{finalAmount.toFixed(2)}</strong>
            </p>
            <button
              onClick={placeOrder}
              className={styles.buyNowButton}
              title="Place Order"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
