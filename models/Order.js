import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  type: { type: String, enum: ["buy", "rent"], required: true },
  rentalDays: { type: Number, default: 0 }, // 0 for buy
  totalCost: { type: Number, required: true }, // Price or rental fee + deposit
  securityDeposit: { type: Number, default: 0 }, // Only for rent
  status: {
    type: String,
    enum: ["pending", "delivered", "returned"],
    default: "pending",
  },
  deliveryAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
