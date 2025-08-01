// services/meetingService.js

const MeetingHistory = require("../model/schema/meeting");
const Contact = require("../model/schema/contact");
const Lead = require("../model/schema/lead");
const mongoose = require("mongoose");
const { Errors } = require("../utils/error.util");
const { verifyRefs } = require("./baseService");

/**
 * Get non-deleted meeting views by filter
 * @param {*} filter
 * @param {*} page
 * @param {*} limit
 * @returns
 */
async function getMeetingViews(filter, page, limit) {
  // populate contacts, leads, and creator user
  const meetings = await MeetingHistory.find({ ...filter, deleted: false })
    .populate("attendes", "firstName lastName")
    .populate("attendesLead", "leadName")
    .populate("createBy", "_id firstName lastName")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return meetings.map((doc) => mapToMeetingView(doc));
}

/** Get all meetings for superuser or unfiltered */
async function getAllMeetingViews(page, limit) {
  return getMeetingViews({}, page, limit);
}

/** Get meetings by creator user ID */
async function getMeetingViewsByCreator(creatorId, page, limit) {
  return getMeetingViews({ createBy: creatorId }, page, limit);
}

/**
 * Fetch a single non-deleted meeting by ID
 * @param {string} id - The ID of the meeting
 * @throws {Error} if ID is invalid or not found
 */
async function getMeetingViewById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Errors.invalidId(id);
  }

  const meeting = await MeetingHistory.findOne({
    _id: id,
    deleted: false,
  })
    .populate("attendes", "firstName lastName")
    .populate("attendesLead", "leadName")
    .populate("createBy", "_id firstName lastName");

  if (!meeting) {
    return null;
  }

  const meetingView = mapToMeetingView(meeting);

  return meetingView;
}

/**
 * Create a new meeting
 */
async function createMeeting(data) {
  // verify referenced contacts and leads
  await verifyRefs(data.attendes, Contact, "Contact");
  await verifyRefs(data.attendesLead, Lead, "Lead");

  // The user can not create a deleted meeting
  data.deleted = false;

  const m = new MeetingHistory(data);

  return await m.save();
}

/**
 * Update an existing non-deleted meeting
 * @throws {Error} if ID is invalid or not found
 */
async function updateMeeting(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Errors.invalidId(id);
  }

  await verifyRefs(data.attendes, Contact, "Contact");
  await verifyRefs(data.attendesLead, Lead, "Lead");

  // The user can not delete a meeting by updating it
  data.deleted = false;

  const updated = await MeetingHistory.findOneAndUpdate(
    { _id: id, deleted: false },
    data,
    { new: true }
  );

  return updated;
}

/**
 * Soft-delete a meeting by ID
 * @throws {Error} if ID is invalid or not found
 */
async function deleteMeeting(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Errors.invalidId(id);
  }

  const deleted = await MeetingHistory.findOneAndUpdate(
    { _id: id, deleted: false },
    { deleted: true },
    { new: true }
  );

  return deleted;
}

/**
 * Soft-delete multiple meetings by IDs array
 */
async function deleteManyMeetings(ids) {
  if (
    !Array.isArray(ids) ||
    !ids.every((i) => mongoose.Types.ObjectId.isValid(i))
  ) {
    throw Errors.invalidId(ids, "Invalid IDs array");
  }

  const result = await MeetingHistory.updateMany(
    { _id: { $in: ids }, deleted: false },
    { deleted: true }
  );

  return result.modifiedCount;
}

/**
 * Count all non-deleted documents
 */
async function countDocuments() {
  return await MeetingHistory.countDocuments({ deleted: false });
}

/**
 * Insert multiple meetings
 * @param {Array} meetings
 * @returns {Promise<Array>}
 */
async function insertMany(meetings) {
  const insertedDocs = await MeetingHistory.insertMany(meetings);
  // extract and return only the _id field from each document
  return insertedDocs.map((doc) => doc._id.toString());
}

function mapToMeetingView(doc) {
  return {
    _id: doc._id,
    agenda: doc.agenda,
    attendes: doc.attendes.map((c) => ({
      id: c._id,
      firstName: c.firstName,
      lastName: c.lastName,
    })),
    attendesLead: doc.attendesLead.map((l) => ({
      id: l._id,
      leadName: l.leadName,
    })),
    location: doc.location,
    related: doc.related,
    dateTime: doc.dateTime,
    notes: doc.notes,
    createBy: String(doc.createBy._id),
    createdByName:
      (doc.createBy.firstName ?? "") + " " + (doc.createBy.lastName ?? "") ||
      "",
    timestamp: doc.timestamp,
  };
}

module.exports = {
  getMeetingViews,
  getAllMeetingViews,
  getMeetingViewsByCreator,
  getMeetingViewById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  deleteManyMeetings,
  countDocuments,
  insertMany,
};
