import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    // ✅ Ensure password is correctly defined
    type: String,
    required: true,
  },
  business_name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
