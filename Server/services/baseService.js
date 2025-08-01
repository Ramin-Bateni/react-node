// services/baseService.js

const mongoose = require("mongoose");
const { Errors } = require("../utils/error.util");

/**
 * Ensure all referenced IDs exist in the given model
 */
async function verifyRefs(ids = [], Model, entityName) {
  if (
    !Array.isArray(ids) ||
    !ids.every((i) => mongoose.Types.ObjectId.isValid(i))
  ) {
    throw Errors.invalidRefIds(
      ids,
      `One or more ${entityName} IDs are invalid`
    );
  }

  if (ids.length == 0) {
    return;
  }

  const foundCount = await Model.countDocuments({ _id: { $in: ids } });

  // If some IDs are not found
  if (foundCount !== ids.length) {
    throw Errors.invalidRefIds(ids);
  }
}

module.exports = {
  verifyRefs,
};
