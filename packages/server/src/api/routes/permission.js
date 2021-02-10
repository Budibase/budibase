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

function generateValidator() {
  const permLevelArray = Object.values(PermissionLevels)
  // prettier-ignore
  return joiValidator.params(Joi.object({
    level: Joi.string().valid(...permLevelArray).required(),
    resourceId: Joi.string(),
    roleId: Joi.string(),
  }).unknown(true))
}

router
  .get("/api/permission/builtin", authorized(BUILDER), controller.fetchBuiltin)
  .get("/api/permission/levels", authorized(BUILDER), controller.fetchLevels)
  .get("/api/permission", authorized(BUILDER), controller.fetch)
  .get(
    "/api/permission/:resourceId",
    authorized(BUILDER),
    controller.getResourcePerms
  )
  // adding a specific role/level for the resource overrides the underlying access control
  .post(
    "/api/permission/:roleId/:resourceId/:level",
    authorized(BUILDER),
    generateValidator(),
    controller.addPermission
  )
  // deleting the level defaults it back the underlying access control for the resource
  .delete(
    "/api/permission/:roleId/:resourceId/:level",
    authorized(BUILDER),
    generateValidator(),
    controller.removePermission
  )

module.exports = router
