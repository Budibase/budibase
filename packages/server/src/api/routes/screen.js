const Router = require("@koa/router")
const controller = require("../controllers/screen")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const joiValidator = require("../../middleware/joi-validator")
const Joi = require("joi")

const router = Router()

function generateSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _css: Joi.string().allow(""),
    name: Joi.string().required(),
    routing: Joi.object({
      route: Joi.string().required(),
      accessLevelId: Joi.string().required().allow(""),
    }).required().unknown(true),
    props: Joi.object({
      _id: Joi.string().required(),
      _component: Joi.string().required(),
      _children: Joi.array().required(),
      _instanceName: Joi.string().required(),
      _styles: Joi.object().required(),
      type: Joi.string().optional(),
      table: Joi.string().optional(),
      layoutId: Joi.string().optional(),
    }).required().unknown(true),
  }).unknown(true))
}

router
  .get("/api/screens", authorized(BUILDER), controller.fetch)
  .post(
    "/api/screens",
    authorized(BUILDER),
    generateSaveValidation(),
    controller.save
  )
  .delete(
    "/api/screens/:screenId/:screenRev",
    authorized(BUILDER),
    controller.destroy
  )

module.exports = router
