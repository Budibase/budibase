const Router = require("@koa/router")
const controller = require("../controllers/role")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const Joi = require("joi")
const joiValidator = require("../../middleware/joi-validator")
const {
  BUILTIN_PERMISSION_IDS,
} = require("../../utilities/security/permissions")

const router = Router()

function generateValidator() {
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

router
  .post("/api/roles", authorized(BUILDER), generateValidator(), controller.save)
  .get("/api/roles", authorized(BUILDER), controller.fetch)
  .get("/api/roles/:roleId", authorized(BUILDER), controller.find)
  .delete("/api/roles/:roleId/:rev", authorized(BUILDER), controller.destroy)

module.exports = router
