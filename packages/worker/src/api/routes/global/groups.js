const Router = require("@koa/router")
const controller = require("../../controllers/global/groups")
const joiValidator = require("../../../middleware/joi-validator")
const adminOnly = require("../../../middleware/adminOnly")
const Joi = require("joi")

const router = Router()

function buildGroupSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    color: Joi.string().required(),
    icon: Joi.string().required(),
    name: Joi.string().required(),
    users: Joi.array().optional(),
    apps: Joi.array().optional(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
  }).required())
}

router
  .post(
    "/api/global/groups",
    adminOnly,
    buildGroupSaveValidation(),
    controller.save
  )
  .get("/api/global/groups", controller.fetch)
  .delete("/api/global/groups/:id/:rev", adminOnly, controller.destroy)
  .get("/api/global/groups/:id", adminOnly, controller.find)

module.exports = router
