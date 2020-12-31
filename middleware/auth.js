const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Get user's JWT token from each request headers
  const token = req.header("x-auth-token") || req.query.token;
  if (!token) {
    // If no token provided, bail
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Get user information from JWT
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
    // Add user Object to the request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
