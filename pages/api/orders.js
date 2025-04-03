import dbConnect from "../../lib/dbConnect";
import Order from "../../models/Order";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    // ✅ Convert user and book to ObjectId
    const orderData = {
      ...req.body,
      user: new mongoose.Types.ObjectId(req.body.user),
      book: new mongoose.Types.ObjectId(req.body.book),
    };

    // ✅ Create and save the order
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
}
