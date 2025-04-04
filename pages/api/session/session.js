import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor";

// Ensure server boot time is stored
if (!global.sessionStartTime) {
  global.sessionStartTime = new Date();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { userId, role, loginTime } = req.body;

  if (!userId || !role || !loginTime) {
    return res.status(400).json({ valid: false, message: "Missing credentials" });
  }

  try {
    let user = null;

    if (role === "vendor") {
      user = await Vendor.findById(userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(401).json({ valid: false, message: "User not found" });
    }

    const sessionStartTime = new Date(global.sessionStartTime);
    const clientLoginTime = new Date(loginTime);

    // ✅ Grace period to avoid invalidating fresh logins due to clock mismatch
    if (clientLoginTime.getTime() + 5000 < sessionStartTime.getTime()) {
      return res.status(401).json({
        valid: false,
        message: "Session expired due to server restart",
      });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Session check error:", error);
    return res.status(500).json({
      valid: false,
      message: "Server error during session check",
    });
  }
}
