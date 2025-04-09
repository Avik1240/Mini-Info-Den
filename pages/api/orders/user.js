// /pages/api/orders/user.js
import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const orders = await Order.find({ userId })
      .populate("items.bookId", "title price author")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
