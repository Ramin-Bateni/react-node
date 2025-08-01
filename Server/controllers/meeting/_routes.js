const express = require("express");
const meeting = require("./meeting");
const auth = require("../../middelwares/auth.js");
const {
  validateCreate,
  validateUpdate,
} = require("../../validators/meetingValidator.js");

const router = express.Router();

// List all meetings
router.get("/", auth, meeting.index);

// Add a new meeting
router.post("/add", auth, validateCreate, meeting.add);

// View a meeting by ID
router.get("/view/:id", auth, meeting.view);

// Edit a meeting by ID
router.put("/edit/:id", auth, validateUpdate, meeting.update);

// Delete a meeting by ID
router.delete("/delete/:id", auth, meeting.deleteData);

// Bulk delete meetings
router.post("/deleteMany", auth, meeting.deleteMany);

module.exports = router;
