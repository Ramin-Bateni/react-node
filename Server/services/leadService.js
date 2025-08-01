// services/leadService.js

const { Lead } = require("../model/schema/lead");

/**
 * Find leads with optional filtering and limit
 * @param {*} filter
 * @param {*} limit
 * @returns
 */
async function find(filter, limit) {
  return await Lead.find(filter).limit(limit).exec();
}

/**
 * Insert multiple leads
 * @param {Array} leads
 * @returns {Promise<Array>}
 */
async function insertMany(leads) {
  const insertedDocs = await Lead.insertMany(leads);
  // extract and return only the _id field from each document
  return insertedDocs.map((doc) => doc._id.toString());
}

/**
 * Count all non-deleted documents
 */
async function countDocuments(filter) {
  return await Lead.countDocuments({ ...filter, deleted: false });
}

module.exports = {
  find,
  insertMany,
  countDocuments,
};
