import joiValidator from "../../../middleware/joi-validator"
import Joi from "joi"

let schema: any = {
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

export const buildUserSaveValidation = (isSelf = false) => {
  if (!isSelf) {
    schema = {
      ...schema,
      _id: Joi.string(),
      _rev: Joi.string(),
    }
  }
  return joiValidator.body(Joi.object(schema).required().unknown(true))
}

export const buildUserBulkSaveValidation = (isSelf = false) => {
  if (!isSelf) {
    schema = {
      ...schema,
      _id: Joi.string(),
      _rev: Joi.string(),
    }
  }
  let bulkSaveSchema = {
    groups: Joi.array().optional(),
    users: Joi.array().items(Joi.object(schema).required().unknown(true)),
  }

  return joiValidator.body(Joi.object(bulkSaveSchema).required().unknown(true))
}
