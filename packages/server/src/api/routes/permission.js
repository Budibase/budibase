const Router = require("@koa/router")
const controller = require("../controllers/permission")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const Joi = require("joi")
const joiValidator = require("../../middleware/joi-validator")

const router = Router()

function generateAddValidator() {
  const permLevelArray = Object.values(PermissionLevels)
  // prettier-ignore
  return joiValidator.body(Joi.object({
    permissions: Joi.object()
      .pattern(/.*/, [Joi.string().valid(...permLevelArray)])
      .required()
  }).unknown(true))
}

function generateRemoveValidator() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    permissions: Joi.array().items(Joi.string())
  }).unknown(true))
}

router
  .get("/api/permission/builtin", authorized(BUILDER), controller.fetchBuiltin)
  .get("/api/permission/levels", authorized(BUILDER), controller.fetchLevels)
  .patch(
    "/api/permission/:roleId/add",
    authorized(BUILDER),
    generateAddValidator(),
    controller.addPermission
  )
  .patch(
    "/api/permission/:roleId/remove",
    authorized(BUILDER),
    generateRemoveValidator(),
    controller.removePermission
  )

module.exports = router
