/**
 * JWT Authentication Middleware
 * It allows for token creation with options like expiration, and verification of tokens using a secret key or public key.
 For instance, a token can be signed with a payload and secret, and verified later to ensure authenticity.
 *
 * WHY:
 * - Protects private APIs
 * - Validates JWT
 * - Attaches user info to request
 */
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔑 Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
