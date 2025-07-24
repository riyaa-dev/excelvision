const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // 🧾 Debug log
  console.log("🧾 Incoming Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Bearer token found in header");
    return res.status(401).json({ message: "No token. Authorization denied." });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token only
  console.log("🔑 Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (e.g., ID) to request
    console.log("✅ Token verified. User ID:", decoded.id || decoded._id);
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
