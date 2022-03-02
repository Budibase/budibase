const joiValidator = require("../../middleware/joi-validator")
const Joi = require("joi")

exports.buildUserSaveValidation = (isSelf = false) => {
  let schema = {
    email: Joi.string().allow(null, ""),
    password: Joi.string().allow(null, ""),
    forceResetPassword: Joi.boolean().optional(),
    firstName: Joi.string().allow(null, ""),
    lastName: Joi.string().allow(null, ""),
    builder: Joi.object({
      global: Joi.boolean().optional(),
      apps: Joi.array().optional(),
    })
      .unknown(true)
      .optional(),
    // maps appId -> roleId for the user
    roles: Joi.object().pattern(/.*/, Joi.string()).required().unknown(true),
  }
  if (!isSelf) {
    schema = {
      ...schema,
      _id: Joi.string(),
      _rev: Joi.string(),
    }
  }
  return joiValidator.body(Joi.object(schema).required().unknown(true))
}
