"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "../../styles/Orders.module.css";
import { useRouter } from "next/navigation";
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
    const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser._id);
    }
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`/api/orders/user?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const handleButtonClick = () => {
    router.push("/books");
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        {orders.length === 0 ? (
          <div className={styles.orderEmpty}>
            <h1>Low on knowledge ??</h1>
            <p className={styles.orderExplore}>
              Order to grab some .....
            </p>
            <p className={styles.orderText}>You haven't placed any orders yet.</p>
            <button
              onClick={handleButtonClick}
              className={styles.viewBooksButton}
            >
              View Books
            </button>
          </div>
        ) : (
          <div>
            <h1>Your Orders</h1>
            <div className={styles.orderWrap}>
              {orders.map((order, index) => (
                <div key={index} className={styles.orderCard}>
                  <h3>Order ID: {order._id}</h3>
                  <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                  <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
                  <div className={styles.itemsList}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={styles.item}>
                        <h4>{item.bookId?.title}</h4>
                        <p>Author: {item.bookId?.author}</p>
                        <p>Price: ₹{item.bookId?.price}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
