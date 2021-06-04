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
const { FieldTypes } = require("../../constants")

const router = Router()

function generatePlusDatasourceSchema() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    source: Joi.string().valid("postgres"),
    type: Joi.string().valid("datasource_plus"),
    relationships: Joi.array().required().items(Joi.object({
      from: Joi.string().required(),
      to: Joi.string().required(),
      cardinality: Joi.valid("1:N", "1:1", "N:N").required()
    })),
    entities: Joi.array().required().items(Joi.object({
      type: Joi.string().valid(...Object.values(FieldTypes)).required(),
      name: Joi.string().required(),
    })),
  }).unknown(true))
}

router
  .get("/api/datasources", authorized(BUILDER), datasourceController.fetch)
  .get(
    "/api/datasources/:datasourceId",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    datasourceController.find
  )
  .post(
    "/api/datasources/plus",
    generatePlusDatasourceSchema(),
    datasourceController.plus
  )
  .post("/api/datasources", authorized(BUILDER), datasourceController.save)
  .delete(
    "/api/datasources/:datasourceId/:revId",
    authorized(BUILDER),
    datasourceController.destroy
  )

module.exports = router
