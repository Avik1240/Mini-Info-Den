import connectDB from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function POST(req) {
  await connectDB();

  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    await Cart.findOneAndDelete({ userId });

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
