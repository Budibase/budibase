const {
  DatasourceFieldType,
  QueryType,
  PluginType,
} = require("@budibase/types")
const joi = require("joi")

const DATASOURCE_TYPES = [
  "Relational",
  "Non-relational",
  "Spreadsheet",
  "Object store",
  "Graph",
  "API",
]

function runJoi(validator, schema) {
  const { error } = validator.validate(schema)
  if (error) {
    throw error
  }
}

function validateComponent(schema) {
  const validator = joi.object({
    type: joi.string().allow("component").required(),
    metadata: joi.object().unknown(true).required(),
    hash: joi.string().optional(),
    version: joi.string().optional(),
    schema: joi
      .object({
        name: joi.string().required(),
        settings: joi.array().items(joi.object().unknown(true)).required(),
      })
      .unknown(true),
  })
  runJoi(validator, schema)
}

function validateDatasource(schema) {
  const fieldValidator = joi.object({
    type: joi
      .string()
      .allow(...Object.values(DatasourceFieldType))
      .required(),
    required: joi.boolean().required(),
    default: joi.any(),
    display: joi.string(),
  })

  const queryValidator = joi
    .object({
      type: joi.string().allow(...Object.values(QueryType)),
      fields: joi.object().pattern(joi.string(), fieldValidator),
    })
    .required()

  const validator = joi.object({
    type: joi.string().allow("datasource").required(),
    metadata: joi.object().unknown(true).required(),
    hash: joi.string().optional(),
    version: joi.string().optional(),
    schema: joi.object({
      docs: joi.string(),
      friendlyName: joi.string().required(),
      type: joi.string().allow(...DATASOURCE_TYPES),
      description: joi.string().required(),
      datasource: joi.object().pattern(joi.string(), fieldValidator).required(),
      query: joi
        .object({
          create: queryValidator,
          read: queryValidator,
          update: queryValidator,
          delete: queryValidator,
        })
        .unknown(true)
        .required(),
    }),
  })
  runJoi(validator, schema)
}

exports.validate = schema => {
  switch (schema?.type) {
    case PluginType.COMPONENT:
      validateComponent(schema)
      break
    case PluginType.DATASOURCE:
      validateDatasource(schema)
      break
    default:
      throw new Error(`Unknown plugin type - check schema.json: ${schema.type}`)
  }
}
