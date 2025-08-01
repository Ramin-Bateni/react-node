const Joi = require("joi");
const meetingService = require("../../services/meetingService");
const { Errors, ValidationError } = require("../../utils/error.util");
const { checkSuperAdmin } = require("../../utils/user-role.util");

const MODEL_NAME = "Meeting";

/// List all meetings (with superAdmin check and optional ?createBy)
const index = async (req, res) => {
  try {
    const { createBy: queryCreator } = req.query;
    const userId = req.user.id;
    const isSuperAdmin = checkSuperAdmin(req.user.role);
    let meetings;

    if (isSuperAdmin) {
      // superAdmin sees all, or filtered by ?createBy
      if (queryCreator) {
        meetings = await meetingService.getMeetingViewsByCreator(queryCreator);
      } else {
        meetings = await meetingService.getAllMeetingViews();
      }
    } else {
      // Non-superAdmins see only created meetings by themselves
      meetings = await meetingService.getMeetingViewsByCreator(userId);
    }

    return res.json(meetings);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json(Errors.msg("Internal server error"));
  }
};

/// View a single meeting by ID
const view = async (req, res) => {
  try {
    const id = req.params.id;
    const meeting = await meetingService.getMeetingViewById(id);

    // If not found
    if (!meeting) {
      return res.status(404).json(Errors.msgNotFound(id, MODEL_NAME));
    }

    return res.json(meeting);
  } catch (err) {
    // If validation error
    if (err instanceof ValidationError) {
      // Invalid Id
      return res.status(400).json(Errors.msg(err.message));
    }
    // 500 otherwise
    return res
      .status(err.status || 500)
      .json(Errors.msg("Internal server error"));
  }
};

/// Create a new meeting
const add = async (req, res) => {
  try {
    const dto = req.body;
    const created = await meetingService.createMeeting(dto);

    return res.status(201).json(created);
  } catch (err) {
    // If validation error
    if (err instanceof ValidationError) {
      return res.status(400).json(Errors.msg("Validation error"));
    }
    // unexpected errors -> 500
    return res.status(500).json(Errors.msg("Internal server error"));
  }
};

/// Update an existing meeting
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const dto = req.body;

    const updated = await meetingService.updateMeeting(id, dto);

    if (!updated) {
      // not found -> 404
      return res.status(404).json(Errors.msgNotFound(id, MODEL_NAME));
    }

    // success -> return updated meeting
    return res.json(updated);
  } catch (err) {
    // If validation error
    if (err instanceof ValidationError) {
      return res.status(400).json(Errors.msg("Validation error"));
    }
    // unexpected errors -> 500
    return res.status(500).json(Errors.msg("Internal server error"));
  }
};

/// Delete a meeting by ID
const deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    await meetingService.deleteMeeting(id);
    // 204 No Content on successful delete
    return res.status(204).end();
  } catch (err) {
    return res.status(err.status || 500).json(Errors.msg(err.message));
  }
};

/// Delete multiple meetings by array of IDs
const deleteMany = async (req, res) => {
  try {
    const ids = req.body;
    const deletedCount = await meetingService.deleteManyMeetings(ids);
    // 200 status with the number of deleted documents
    return res.status(200).json({ deletedCount });
  } catch (err) {
    // 400 for bad request, 500 otherwise
    return res.status(err.status || 400).json(Errors.msg(err.message));
  }
};

module.exports = { index, view, add, update, deleteData, deleteMany };
