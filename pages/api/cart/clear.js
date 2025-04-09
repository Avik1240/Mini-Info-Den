import connectDB from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import mongoose from "mongoose"; // ✅ Needed for ObjectId

export async function POST(req) {
  await connectDB();

  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    const objectId = new mongoose.Types.ObjectId(userId); // ✅ Convert string to ObjectId

    const deleted = await Cart.findOneAndDelete({ userId: objectId });

    if (!deleted) {
      console.log("No cart found for userId:", userId);
    }

    return new Response(JSON.stringify({ message: "Cart cleared" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Failed to clear cart:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
