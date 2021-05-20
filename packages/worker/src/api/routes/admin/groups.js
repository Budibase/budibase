const Router = require("@koa/router")
const controller = require("../../controllers/admin/groups")
const joiValidator = require("../../../middleware/joi-validator")
const adminOnly = require("../../../middleware/adminOnly")
const Joi = require("joi")

const router = Router()

function buildGroupSaveValidation() {
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
    "/api/admin/groups",
    adminOnly,
    buildGroupSaveValidation(),
    controller.save
  )
  .get("/api/admin/groups", controller.fetch)
  .delete("/api/admin/groups/:id", adminOnly, controller.destroy)
  .get("/api/admin/groups/:id", controller.find)

module.exports = router
