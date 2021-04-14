const Router = require("@koa/router")
const controller = require("../../controllers/admin")
const joiValidator = require("../../../middleware/joi-validator")
const { authenticated } = require("@budibase/auth")
const Joi = require("joi")

const router = Router()

function buildUserSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    email: Joi.string(),
    password: Joi.string().allow(null, ""),
    builder: Joi.object({
      global: Joi.boolean().optional(),
      apps: Joi.array().optional(),
    }).unknown(true).optional(),
    // maps appId -> roleId for the user
    roles: Joi.object()
      .pattern(/.*/, Joi.string())
      .required()
      .unknown(true)
  }).required().unknown(true).optional())
}

router
  .post(
    "/api/admin/users",
    buildUserSaveValidation(),
    authenticated,
    controller.userSave
  )
  .delete("/api/admin/users/:email", authenticated, controller.userDelete)
  .get("/api/admin/users", authenticated, controller.userFetch)
  .get("/api/admin/users/:email", authenticated, controller.userFind)

module.exports = router
