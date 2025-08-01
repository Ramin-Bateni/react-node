// controllers/authController.js

const authService = require("../../services/authService");
const { Errors } = require("../../utils/error.util");
const { InvalidCredentialsError } = require("../../utils/error.util");

/**
 * Handle POST /auth/login
 * Validate credentials and return JWT token and User information in a json
 * {
 *   token: "jwt-token",
 *   user: {
 *     id: "user-id",
 *     email: "user-email",
 *     // other user fields
 *   }
 * }
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const respDto = await authService.authenticateUser(username, password);

    // Return token in JSON response
    res.json(respDto);
  } catch (err) {
    // Use provided status or default to 401 Unauthorized
    const status = err.status || 401;

    if (err instanceof InvalidCredentialsError) {
      return res.status(status).json(Errors.msg(err.message));
    }

    return res.status(500).json(Errors.msg("Internal Server Error"));
  }
};

module.exports = { login };
