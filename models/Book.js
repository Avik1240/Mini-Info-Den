import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  rentalFee: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  available: { type: Boolean, default: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }, // ✅ Added vendor reference
});

export default mongoose.models.Book || mongoose.model('Book', bookSchema);
