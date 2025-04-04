import { serverStartTime } from "../../../lib/dbConnect"; // ✅ This is used for session invalidation after server restart

export default function handler(req, res) {
  return res.status(200).json({ serverStartTime });
}
