// /api/cart/get.js
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await dbConnect();

    const cart = await Cart.findOne({ userId }).populate("items.bookId");

    if (!cart) {
      return res.status(200).json({ cart: [] });
    }

    // Transform cart into frontend-friendly structure
    const formattedCart = cart.items.map((item) => ({
      _id: item.bookId._id,
      title: item.bookId.title,
      author: item.bookId.author,
      price: item.bookId.price,
      rentalFee: item.bookId.rentalFee,
      securityDeposit: item.bookId.securityDeposit,
      vendorId: item.bookId.vendorId,
      quantity: item.quantity,
      bookId: item.bookId._id, // for syncing purposes
    }));

    return res.status(200).json({ cart: formattedCart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
