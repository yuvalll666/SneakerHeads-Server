const jwt = require("jsonwebtoken");
const { userRole } = require("../models/user");
const { NORMAL } = userRole;

module.exports = (req, res, next) => {
  // Get user's JWT token from each request headers
  const token = req.header("x-auth-token") || req.query.token;
  // If no token provided, bail
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Get user information from JWT
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    if (decoded.role === NORMAL) {
      res.status(400).send({
        error: "Access denied. Only Admin or Editor users are authorised.",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
