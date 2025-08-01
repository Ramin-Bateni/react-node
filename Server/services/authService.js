// services/authService.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const { InvalidCredentialsError } = require("../utils/error.util");

/**
 * Verify credentials and issue a JWT token
 * @throws {InvalidCredentialsError} with .status and .message on failure
 */
async function authenticateUser(email, password) {
  let user;

  // Find user by email and password
  user = await userService.findByEmail(email);

  if (!user) {
    //Todo: We can add logger here to check this user in security checks
    throw new InvalidCredentialsError("User not found");
  }

  // compare password with stored hash
  const isValid = await bcrypt.compare(password, user.password);

  // if password is invalid
  if (!isValid) {
    //Todo: We can add logger here to check this user in security checks
    throw new InvalidCredentialsError("Invalid password");
  }

  // JWT Payload
  const payload = {
    id: user._id,
    username: user.username?.toLocaleLowerCase(),
    role: user.role?.toLocaleLowerCase(),
  };

  // Sign a token with 1h expiry
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const respDto = {
    token: token,
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.username,
      role: user.role,
      //roles: [],
      //emailsent: user.emailsent,
      //textsent: user.textsent,
      outboundcall: user.outboundcall,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      updatedDate: user.updatedDate,
      createdDate: user.createdDate,
    },
  };

  return respDto;
}

module.exports = { authenticateUser };
