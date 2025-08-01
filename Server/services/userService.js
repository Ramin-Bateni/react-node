// services/userService.js

const User = require("../model/schema/user");

/**
 * Find users with optional filtering and limit
 * @param {*} filter
 * @param {*} limit
 * @returns
 */
async function find(filter, limit) {
  return await User.find(filter).limit(limit).exec();
}

/**
 * Fetch a single user by email
 */
async function findByEmail(email) {
  // 1. Trim and toLowerCase
  const normalizedEmail = (email ?? "").trim().toLowerCase();

  // find user by email
  const user = await User.findOne({ username: normalizedEmail }).exec();

  return user;
}

/**
 * Insert multiple users
 * @param {Array} users
 * @returns {Promise<Array>}
 */
async function insertMany(users) {
  const insertedDocs = await User.insertMany(users);
  // extract and return only the _id field from each document
  return insertedDocs.map((doc) => doc._id.toString());
}

/**
 * Count all non-deleted documents
 */
async function countDocuments(filter) {
  return await User.countDocuments({ ...filter, deleted: false });
}

module.exports = {
  find,
  findByEmail,
  insertMany,
  countDocuments,
};
