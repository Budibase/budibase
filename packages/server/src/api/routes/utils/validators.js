const joiValidator = require("../../../middleware/joi-validator")
const { DataSourceOperation } = require("../../../constants")
const { WebhookType } = require("../../../constants")
const {
  BUILTIN_PERMISSION_IDS,
  PermissionLevels,
} = require("@budibase/backend-core/permissions")
const Joi = require("joi")

exports.tableValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    type: Joi.string().valid("table", "internal", "external"),
    primaryDisplay: Joi.string(),
    schema: Joi.object().required(),
    name: Joi.string().required(),
    views: Joi.object(),
    dataImport: Joi.object(),
  }).unknown(true))
}

exports.nameValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    name: Joi.string(),
  }))
}

exports.datasourceValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    // source: Joi.string().valid("POSTGRES_PLUS"),
    type: Joi.string().allow("datasource_plus"),
    relationships: Joi.array().items(Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
      cardinality: Joi.valid("1:N", "1:1", "N:N").required()
    })),
    // entities: Joi.array().items(Joi.object({
    //   type: Joi.string().valid(...Object.values(FieldTypes)).required(),
    //   name: Joi.string().required(),
    // })),
  }).unknown(true))
}

function filterObject() {
  return Joi.object({
    string: Joi.object().optional(),
    fuzzy: Joi.object().optional(),
    range: Joi.object().optional(),
    equal: Joi.object().optional(),
    notEqual: Joi.object().optional(),
    empty: Joi.object().optional(),
    notEmpty: Joi.object().optional(),
    oneOf: Joi.object().optional(),
  })
}

exports.internalSearchValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    tableId: Joi.string(),
    query: filterObject(),
    limit: Joi.number().optional(),
    sort: Joi.string().optional(),
    sortOrder: Joi.string().optional(),
    sortType: Joi.string().optional(),
    paginate: Joi.boolean().optional(),
    bookmark: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
  }))
}

exports.externalSearchValidator = () => {
  return joiValidator.body(
    Joi.object({
      query: filterObject(),
      paginate: Joi.boolean().optional(),
      bookmark: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
      limit: Joi.number().optional(),
      sort: Joi.object({
        column: Joi.string(),
        order: Joi.string().optional().valid("ascending", "descending"),
        type: Joi.string().valid("string", "number"),
      }).optional(),
    })
  )
}

exports.datasourceQueryValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    endpoint: Joi.object({
      datasourceId: Joi.string().required(),
      operation: Joi.string().required().valid(...Object.values(DataSourceOperation)),
      entityId: Joi.string().required(),
    }).required(),
    resource: Joi.object({
      fields: Joi.array().items(Joi.string()).optional(),
    }).optional(),
    body: Joi.object().optional(),
    sort: Joi.object().optional(),
    filters: filterObject().optional(),
    paginate: Joi.object({
      page: Joi.string().alphanum().optional(),
      limit: Joi.number().optional(),
    }).optional(),
  }))
}

exports.webhookValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    live: Joi.bool(),
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    name: Joi.string().required(),
    bodySchema: Joi.object().optional(),
    action: Joi.object({
      type: Joi.string().required().valid(WebhookType.AUTOMATION),
      target: Joi.string().required(),
    }).required(),
  }).unknown(true))
}

exports.roleValidator = () => {
  const permLevelArray = Object.values(PermissionLevels)
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    name: Joi.string().required(),
    // this is the base permission ID (for now a built in)
    permissionId: Joi.string().valid(...Object.values(BUILTIN_PERMISSION_IDS)).required(),
    permissions: Joi.object()
      .pattern(/.*/, [Joi.string().valid(...permLevelArray)])
      .optional(),
    inherits: Joi.string().optional(),
  }).unknown(true))
}

exports.permissionValidator = () => {
  const permLevelArray = Object.values(PermissionLevels)
  // prettier-ignore
  return joiValidator.params(Joi.object({
    level: Joi.string().valid(...permLevelArray).required(),
    resourceId: Joi.string(),
    roleId: Joi.string(),
  }).unknown(true))
}

exports.screenValidator = () => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    name: Joi.string().required(),
    routing: Joi.object({
      route: Joi.string().required(),
      roleId: Joi.string().required().allow(""),
    }).required().unknown(true),
    props: Joi.object({
      _id: Joi.string().required(),
      _component: Joi.string().required(),
      _children: Joi.array().required(),
      _instanceName: Joi.string().required(),
      _styles: Joi.object().required(),
      type: Joi.string().optional(),
      table: Joi.string().optional(),
      layoutId: Joi.string().optional(),
    }).required().unknown(true),
  }).unknown(true))
}

function generateStepSchema(allowStepTypes) {
  // prettier-ignore
  return Joi.object({
    stepId: Joi.string().required(),
    id: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    tagline: Joi.string().required(),
    icon: Joi.string().required(),
    params: Joi.object(),
    args: Joi.object(),
    type: Joi.string().required().valid(...allowStepTypes),
  }).unknown(true)
}

exports.automationValidator = (existing = false) => {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: existing ? Joi.string().required() : Joi.string(),
    _rev: existing ? Joi.string().required() : Joi.string(),
    name: Joi.string().required(),
    type: Joi.string().valid("automation").required(),
    definition: Joi.object({
      steps: Joi.array().required().items(generateStepSchema(["ACTION", "LOGIC"])),
      trigger: generateStepSchema(["TRIGGER"]).allow(null),
    }).required().unknown(true),
  }).unknown(true))
}

exports.applicationValidator = () => {}
