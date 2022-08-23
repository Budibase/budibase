const Router = require("@koa/router")
const controller = require("../../controllers/global/workspaces")
const { joiValidator } = require("@budibase/backend-core/auth")
const { adminOnly } = require("@budibase/backend-core/auth")
const Joi = require("joi")

const router = Router()

function buildWorkspaceSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    name: Joi.string().required(),
    users: Joi.array().required(),
    managers: Joi.array().required(),
    roles: Joi.object({
      default: Joi.string().optional(),
      app: Joi.object()
        .pattern(/.*/, Joi.string())
        .required()
        .unknown(true),
    }).unknown(true).optional(),
  }).required().unknown(true))
}

router
  .post(
    "/api/global/workspaces",
    adminOnly,
    buildWorkspaceSaveValidation(),
    controller.save
  )
  .delete("/api/global/workspaces/:id", adminOnly, controller.destroy)
  .get("/api/global/workspaces", controller.fetch)
  .get("/api/global/workspaces/:id", controller.find)

module.exports = router
