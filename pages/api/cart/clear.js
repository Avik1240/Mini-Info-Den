import connectDB from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOneAndUpdate(
      { userId: objectId },
      { $set: { items: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "No cart found" });
    }

    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Failed to clear cart:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
