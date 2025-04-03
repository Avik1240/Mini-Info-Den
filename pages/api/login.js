import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Vendor from '../../models/Vendor';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Vendor.findOne({ email });
      role = "vendor";
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        role,
        vendorId: role === "vendor" ? user._id : null, // Only vendors get this
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
