import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")

function baseQueryValidation() {
  return {
    _id: OPTIONAL_STRING,
    _rev: OPTIONAL_STRING,
    fields: Joi.object().required(),
    datasourceId: Joi.string().required(),
    readable: Joi.boolean(),
    parameters: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        default: Joi.string().allow(""),
      })
    ),
    queryVerb: Joi.string().required(),
    extra: Joi.object().optional(),
    schema: Joi.object({}).required().unknown(true),
    transformer: OPTIONAL_STRING,
    flags: Joi.object().optional(),
    queryId: OPTIONAL_STRING,
  }
}

export function queryValidation() {
  return Joi.object({
    ...baseQueryValidation(),
    name: Joi.string().required(),
  }).unknown(true)
}

export function generateQueryValidation() {
  // prettier-ignore
  return auth.joiValidator.body(queryValidation())
}

export function generateQueryPreviewValidation() {
  // prettier-ignore
  return auth.joiValidator.body(
    Joi.object({
      ...baseQueryValidation(),
      name: OPTIONAL_STRING,
    }).unknown(true)
  )
}
