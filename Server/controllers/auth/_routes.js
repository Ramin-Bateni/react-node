// routes/auth.js

const express = require("express");
const router = express.Router();
const { login } = require("./auth");

// POST /auth/login
router.post("/login", login);

module.exports = router;
