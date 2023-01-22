import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")

export function queryValidation() {
  return Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    name: Joi.string().required(),
    fields: Joi.object().required(),
    datasourceId: Joi.string().required(),
    readable: Joi.boolean(),
    parameters: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        default: Joi.string().allow(""),
      })
    ),
    queryVerb: Joi.string().allow().required(),
    extra: Joi.object().optional(),
    schema: Joi.object({}).required().unknown(true),
    transformer: OPTIONAL_STRING,
    flags: Joi.object().optional(),
  }).unknown(true)
}

export function generateQueryValidation() {
  // prettier-ignore
  return auth.joiValidator.body(queryValidation())
}

export function generateQueryPreviewValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    _id: OPTIONAL_STRING,
    _rev: OPTIONAL_STRING,
    readable: Joi.boolean().optional(),
    fields: Joi.object().required(),
    queryVerb: Joi.string().required(),
    name: OPTIONAL_STRING,
    flags: Joi.object().optional(),
    schema: Joi.object().optional(),
    extra: Joi.object().optional(),
    datasourceId: Joi.string().required(),
    transformer: OPTIONAL_STRING,
    parameters: Joi.object({}).required().unknown(true),
    queryId: OPTIONAL_STRING,
  }).unknown(true))
}
