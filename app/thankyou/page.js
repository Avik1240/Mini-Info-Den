"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "../../styles/Thank.module.css";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    }
  }, [searchParams]);

  return (
    <div>
      <Navbar />
      <div className={styles.thankContainer}>
        <div>
          <h1>Order Placed Successfully!</h1>
          <p>Your books will be delivered shortly.</p>
          {orderId && (
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
          )}
          <p>Thank you for shopping with us</p>
          <Link href="/books">
            <button className={styles.continueShoppingButton}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
