import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().allow(null, "")

let schema: any = {
  email: OPTIONAL_STRING,
  password: OPTIONAL_STRING,
  forceResetPassword: Joi.boolean().optional(),
  firstName: OPTIONAL_STRING,
  lastName: OPTIONAL_STRING,
  builder: Joi.object({
    global: Joi.boolean().optional(),
    apps: Joi.array().optional(),
  })
    .unknown(true)
    .optional(),
  // maps appId -> roleId for the user
  roles: Joi.object().pattern(/.*/, Joi.string()).required().unknown(true),
}

export const buildSelfSaveValidation = () => {
  schema = {
    password: Joi.string().optional(),
    forceResetPassword: Joi.boolean().optional(),
    firstName: OPTIONAL_STRING,
    lastName: OPTIONAL_STRING,
    onboardedAt: Joi.string().optional(),
  }
  return auth.joiValidator.body(Joi.object(schema).required().unknown(false))
}

export const buildUserSaveValidation = () => {
  schema = {
    ...schema,
    _id: Joi.string(),
    _rev: Joi.string(),
  }
  return auth.joiValidator.body(Joi.object(schema).required().unknown(true))
}

export const buildUserBulkUserValidation = (isSelf = false) => {
  if (!isSelf) {
    schema = {
      ...schema,
      _id: Joi.string(),
      _rev: Joi.string(),
    }
  }
  let bulkSchema = {
    create: Joi.object({
      groups: Joi.array().optional(),
      users: Joi.array().items(Joi.object(schema).required().unknown(true)),
    }),
    delete: Joi.object({
      userIds: Joi.array().items(Joi.string()),
    }),
  }

  return auth.joiValidator.body(Joi.object(bulkSchema).required().unknown(true))
}
