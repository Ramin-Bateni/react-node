const express = require("express");
const db = require("./db/config");
const route = require("./controllers/route");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const fs = require("fs");
const path = require("path");

//Setup Express App
const app = express();

// strip quoted charset from content-type header
app.use((req, res, next) => {
  const ct = req.headers["content-type"];
  if (typeof ct === "string" && ct.includes('charset="')) {
    // remove the quotes around charset value
    req.headers["content-type"] = ct.replace(/charset="([^"]+)"/, "charset=$1");
  }
  next();
});

// Middleware
app.use(bodyParser.json());

// Set up CORS
app.use(cors());
//API Routes
app.use("/api", route);

app.get("/", async (req, res) => {
  res.send("Welcome to my world...");
});

// Get port from environment and store in Express.

const port = process.env.PORT || 5001;

// Start only if the file is run directly
if (require.main === module) {
  const server = app.listen(port, () => {
    const protocol =
      process.env.HTTPS === true || process.env.NODE_ENV === "production"
        ? "https"
        : "http";
    const { address, port } = server.address();
    const host = address === "::" ? "127.0.0.1" : address;
    console.log(`Server listening at ${protocol}://${host}:${port}/`);
  });
}

// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const DATABASE = process.env.DB_NAME || "Prolink";

db(DATABASE_URL, DATABASE);

module.exports = app;
