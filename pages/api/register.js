import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Vendor from '../../models/Vendor'; // ✅ Import Vendor model
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { email, password, name, business_name, isVendor } = req.body; // ✅ Receive isVendor flag

  try {
    // Check if user or vendor already exists
    const existingUser = await User.findOne({ email });
    const existingVendor = await Vendor.findOne({ email });

    if (existingUser || existingVendor) {
      return res.status(400).json({ message: 'User or Vendor already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isVendor) {
      // ✅ Register as Vendor
      const vendor = new Vendor({
        name,
        business_name,
        email,
        password: hashedPassword,
      });
      await vendor.save();

      res.status(201).json({
        message: 'Vendor registered successfully',
        user: { _id: vendor._id, email: vendor.email, role: 'vendor', vendorId: vendor._id },
      });
    } else {
      // ✅ Register as User
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json({
        message: 'User registered successfully',
        user: { _id: user._id, email: user.email, role: 'user' },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
