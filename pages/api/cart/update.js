// /api/cart/update.js
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, cart } = req.body;

  if (!email || !Array.isArray(cart)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatePayload = {
      userId: user._id,
      items: cart.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      })),
    };

    // ✅ if cart is empty, update with empty items array
    await Cart.findOneAndUpdate({ userId: user._id }, updatePayload, {
      upsert: true,
      new: true,
    });

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
