// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    const token = req.session?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.payload.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Role not allowed" });
      }

      req.user = decoded.payload; // attach user to request
      next();
      
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
}
