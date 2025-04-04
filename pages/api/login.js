import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
import Vendor from "../../models/Vendor";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { email, password, isVendor } = req.body;

  try {
    let user = null;
    let role = null;

    if (isVendor) {
      user = await Vendor.findOne({ email });
      role = "vendor";
    } else {
      user = await User.findOne({ email });
      role = "user";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Extra protection: Check if user actually exists in correct collection
    if ((isVendor && role !== "vendor") || (!isVendor && role !== "user")) {
      return res
        .status(403)
        .json({ message: "Unauthorized login attempt: role mismatch" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        role,
        vendorId: role === "vendor" ? user._id : null, // Only vendors get this
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
