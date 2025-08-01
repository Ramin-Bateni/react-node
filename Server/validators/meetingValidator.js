// src/validators/meetingValidator.js
const Joi = require("joi");
const mongoose = require("mongoose");

// Custom ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

// Schema for creating a new meeting
const createSchema = Joi.object({
  agenda: Joi.string().required(),
  attendes: Joi.array().items(objectId).default([]),
  attendesLead: Joi.array().items(objectId).default([]),
  location: Joi.string().allow("", null),
  related: Joi.string().allow("", null),
  dateTime: Joi.string().required(),
  notes: Joi.string().allow("", null),
  createBy: objectId.required(),
}).options({ stripUnknown: true, allowUnknown: false });

// Schema for updating an existing meeting (at least one field required)
const updateSchema = Joi.object({
  agenda: Joi.string().optional(),
  attendes: Joi.array().items(objectId).optional(),
  attendesLead: Joi.array().items(objectId).optional(),
  location: Joi.string().allow("", null).optional(),
  related: Joi.string().allow("", null).optional(),
  dateTime: Joi.string().optional(),
  notes: Joi.string().allow("", null).optional(),
})
  .min(1)
  .options({ stripUnknown: true, allowUnknown: false });

// Generic middleware factory
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      // send first validation error
      return res.status(400).json({ message: error.details[0].message });
    }

    // replace body with the cleaned value
    req.body = value;
    next();
  };
}

module.exports = {
  validateCreate: validateBody(createSchema),
  validateUpdate: validateBody(updateSchema),
};
