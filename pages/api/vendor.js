import dbConnect from "../../lib/dbConnect";
import Vendor from "../../models/Vendor";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { name, email, password, business_name, isLogin } = req.body;

    try {
      if (isLogin) {
        const vendor = await Vendor.findOne({ email });
        if (!vendor)
          return res
            .status(404)
            .json({ success: false, message: "Vendor not found" });

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch)
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });

        return res.status(200).json({
          success: true,
          message: "Vendor login successful",
          user: { _id: vendor._id, email: vendor.email, vendorId: vendor._id },
        });
      }

      // ✅ Vendor Registration
      if (!name || !email || !password || !business_name) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const existingVendor = await Vendor.findOne({ email });
      if (existingVendor) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Vendor with this email already exists",
          });
      }

      // 🔐 Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newVendor = new Vendor({
        name,
        email,
        password: hashedPassword, // Ensure password is being assigned here
        business_name,
      });

      await newVendor.save();

      return res.status(201).json({
        success: true,
        message: "Vendor registered successfully",
        data: {
          _id: newVendor._id,
          email: newVendor.email,
          business_name: newVendor.business_name,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method Not Allowed" });
}
