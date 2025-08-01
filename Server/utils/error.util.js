// utils/error.util.js

class NotFoundError extends Error {}
class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCredentialsError - ";
    // Unauthorized
    this.status = 401;
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

/*
    Error handling utilities
*/
class Errors {
  /**
   * Error for invalid ID
   * @param {any} id It can be an id or array of ids
   * @param {string} message
   */
  static invalidId(id, message = "Invalid Id") {
    const err = new ValidationError(message);
    err.code = "INVALID_ID";
    err.details = { id };

    return err;
  }

  static invalidRefIds(ids, message = "One or more reference IDs are invalid") {
    const err = new ValidationError(message);
    err.code = "INVALID_REF_IDS";
    err.details = { ids };

    return err;
  }

  /**
   * Create an error with a specific status
   * @param {*} status e.g. 404
   * @param {*} message
   * @returns Error object
   */
  static withStatus(status, message = "") {
    const err = new Error(message);
    err.status = status;

    return err;
  }

  /**
   * msgObj not found to use in responses
   * @param {any} id
   * @param {string} entityName
   * @returns
   */
  static msgNotFound(id, entityName) {
    const space = entityName != "" ? " " : "";
    return { message: `${entityName}${space}not found: ${id}` };
  }

  /**
   * Msg obj to use in responses
   * @param {string} msg
   * @returns
   */
  static msg(msg) {
    return { message: `${msg}` };
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  InvalidCredentialsError,
  Errors,
};
