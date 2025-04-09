// /pages/api/users/index.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user); // ✅ return user directly
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
