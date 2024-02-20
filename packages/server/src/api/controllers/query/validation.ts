import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")

export function queryValidation() {
  return Joi.object({
    _id: OPTIONAL_STRING,
    _rev: OPTIONAL_STRING,
    name: OPTIONAL_STRING,
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
  }).unknown(true)
}

export function generateQueryValidation() {
  // prettier-ignore
  return auth.joiValidator.body(queryValidation())
}
