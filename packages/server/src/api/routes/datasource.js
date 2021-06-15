const Router = require("@koa/router")
const datasourceController = require("../controllers/datasource")
const authorized = require("../../middleware/authorized")
const joiValidator = require("../../middleware/joi-validator")
const {
  BUILDER,
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/auth/permissions")
const Joi = require("joi")
const { DataSourceOperation } = require("../../constants")

const router = Router()

function generateDatasourceSchema() {
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

function generateQueryDatasourceSchema() {
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
    filters: Joi.object({
      string: Joi.object().optional(),
      range: Joi.object().optional(),
      equal: Joi.object().optional(),
      notEqual: Joi.object().optional(),
      empty: Joi.object().optional(),
      notEmpty: Joi.object().optional(),
    }).optional(),
    paginate: Joi.object({
      page: Joi.string().alphanum().optional(),
      limit: Joi.number().optional(),
    }).optional(),
  }))
}

router
  .get("/api/datasources", authorized(BUILDER), datasourceController.fetch)
  .get(
    "/api/datasources/:datasourceId",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    datasourceController.find
  )
  .post(
    "/api/datasources/query",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    generateQueryDatasourceSchema(),
    datasourceController.query
  )
  .post(
    "/api/datasources",
    authorized(BUILDER),
    generateDatasourceSchema(),
    datasourceController.save
  )
  .delete(
    "/api/datasources/:datasourceId/:revId",
    authorized(BUILDER),
    datasourceController.destroy
  )

module.exports = router
