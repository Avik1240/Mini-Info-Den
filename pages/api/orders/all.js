import dbConnect from "../../../lib/dbConnect";
import Order from "../../../models/Order";
import Book from "../../../models/Book";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const orders = await Order.find().populate("book");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
}
