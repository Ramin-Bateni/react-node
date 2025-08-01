// services/contactService.js

const { Contact } = require("../model/schema/contact");

/**
 * Find contacts with optional filtering and limit
 * @param {*} filter
 * @param {*} limit
 * @returns
 */
async function find(filter, limit) {
  return await Contact.find(filter).limit(limit).exec();
}

/**
 * Fetch a single contact by ID
 */
async function findById(id) {
  // find contact by id
  const contact = await Contact.findById(id).exec();

  return contact;
}

/**
 * Insert multiple contacts
 * @param {Array} contacts
 * @returns {Promise<Array>}
 */
async function insertMany(contacts) {
  const insertedDocs = await Contact.insertMany(contacts);
  // extract and return only the _id field from each document
  return insertedDocs.map((doc) => doc._id.toString());
}

/**
 * Count all non-deleted documents
 */
async function countDocuments() {
  return await Contact.countDocuments({ deleted: false });
}

module.exports = {
  find,
  findById,
  insertMany,
  countDocuments,
};
