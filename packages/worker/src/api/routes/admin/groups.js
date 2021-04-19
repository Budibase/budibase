const Router = require("@koa/router")
const controller = require("../../controllers/admin/groups")
const joiValidator = require("../../../middleware/joi-validator")
const { authenticated } = require("@budibase/auth")
const Joi = require("joi")

const router = Router()

function buildGroupSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    // _id: Joi.string(),
    // _rev: Joi.string(),
    // email: Joi.string(),
    // password: Joi.string().allow(null, ""),
    // builder: Joi.object({
    //   global: Joi.boolean().optional(),
    //   apps: Joi.array().optional(),
    // }).unknown(true).optional(),
    // // maps appId -> roleId for the user
    // roles: Joi.object()
    //   .pattern(/.*/, Joi.string())
    //   .required()
    //   .unknown(true)
  }).required().unknown(true).optional())
}

router
  .post(
    "/api/admin/groups",
    buildGroupSaveValidation(),
    authenticated,
    controller.save
  )
  .delete("/api/admin/groups/:id", authenticated, controller.destroy)
  .get("/api/admin/groups", authenticated, controller.fetch)
  .get("/api/admin/group/:id", authenticated, controller.find)

module.exports = router
