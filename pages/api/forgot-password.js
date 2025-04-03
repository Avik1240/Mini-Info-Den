// import dbConnect from "../../lib/dbConnect";
// import User from "../../models/User";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   await dbConnect();
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Generate token (valid for 1 hour)
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     // Send reset link via email
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
//     const mailOptions = {
//       to: user.email,
//       from: process.env.EMAIL_USER,
//       subject: "Password Reset Request",
//       html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Reset link sent to your email." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error sending reset email" });
//   }
// }
