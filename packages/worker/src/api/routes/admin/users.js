const Router = require("@koa/router")
const controller = require("../../controllers/admin/users")
const joiValidator = require("../../../middleware/joi-validator")
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
  .post("/api/admin/users", buildUserSaveValidation(), controller.save)
  .get("/api/admin/users", controller.fetch)
  .post("/api/admin/users/init", controller.adminUser)
  .delete("/api/admin/users/:id", controller.destroy)
  .get("/api/admin/users/:id", controller.find)

module.exports = router
