const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // If no authorization header is present
    // or
    // if it doesn't start with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication failed, token missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    // If no token is present
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed , Token missing" });
    }

    // Check if token is valid
    const decoded = jwt.verify(token, SECRET_KEY);

    // Put the decoded token information into the request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    // Continue to the next middleware
    next();
  } catch (err) {
    // If token is invalid
    res.status(500).json({ message: "Authentication failed. Invalid token." });
  }
};

module.exports = auth;
