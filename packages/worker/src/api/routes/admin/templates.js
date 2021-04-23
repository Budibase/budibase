const Router = require("@koa/router")
const controller = require("../../controllers/admin/templates")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")
const { TemplatePurpose, TemplateTypes } = require("../../../constants")

const router = Router()

function buildTemplateSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string().allow(null, ""),
    _rev: Joi.string().allow(null, ""),
    ownerId: Joi.string().allow(null, ""),
    name: Joi.string().allow(null, ""),
    contents: Joi.string().required(),
    purpose: Joi.string().required().valid(...Object.values(TemplatePurpose)),
    type: Joi.string().required().valid(...Object.values(TemplateTypes)),
  }).required().unknown(true).optional())
}

router
  .get("/api/admin/template/definitions", controller.definitions)
  .post("/api/admin/template", buildTemplateSaveValidation(), controller.save)
  .get("/api/admin/template", controller.fetch)
  .get("/api/admin/template/:type", controller.fetchByType)
  .get("/api/admin/template/:ownerId", controller.fetchByOwner)
  .get("/api/admin/template/:id", controller.find)
  .delete("/api/admin/template/:id/:rev", controller.destroy)

module.exports = router
