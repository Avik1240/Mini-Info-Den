// import dbConnect from "../../lib/dbConnect";
// import User from "../../models/User";
// import bcrypt from "bcryptjs";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   await dbConnect();
//   const { token, newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token." });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update user password and clear token
//     user.password = hashedPassword;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpires = null;
//     await user.save();

//     res.status(200).json({ message: "Password reset successful." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error resetting password" });
//   }
// }
