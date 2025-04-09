import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { userId, email, items, totalAmount } = req.body;

      // ✅ Validate required fields
      if (!userId || !email || !items || items.length === 0 || !totalAmount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // ✅ Create new order
      const newOrder = new Order({
        userId,
        email,
        items,
        totalAmount,
        status: "Pending",
        createdAt: new Date(),
      });

      await newOrder.save();

      // ✅ Send order ID back
      return res.status(200).json({
        message: "Order placed successfully",
        orderId: newOrder._id.toString(), // ensure it's a string
      });
    } catch (err) {
      console.error("❌ Error placing order:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}