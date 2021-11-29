const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")

exports.queryValidation = () => {
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
    transformer: Joi.string().optional(),
  })
}

exports.generateQueryValidation = () => {
  // prettier-ignore
  return joiValidator.body(exports.queryValidation())
}

exports.generateQueryPreviewValidation = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    fields: Joi.object().required(),
    queryVerb: Joi.string().allow().required(),
    extra: Joi.object().optional(),
    datasourceId: Joi.string().required(),
    transformer: Joi.string().optional(),
    parameters: Joi.object({}).required().unknown(true)
  }))
}
