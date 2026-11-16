import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  if (process.env.ENFORCE_AUTH !== "true") return next();

  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const token = authorization.slice("Bearer ".length).trim();
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user || typeof user !== "object") {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (process.env.ENFORCE_AUTH !== "true") return next();
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const role = String(req.user.role || "").toLowerCase();
  if (!roles.some((allowedRole) => allowedRole.toLowerCase() === role)) {
    return res.status(403).json({ message: "You do not have permission to access this resource." });
  }

  return next();
};
