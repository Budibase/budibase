const Router = require("@koa/router")
const joiValidator = require("../../middleware/joi-validator")
const Joi = require("joi")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")
const controller = require("../controllers/page")

const router = Router()

function generateSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _css: Joi.string().allow(""),
    name: Joi.string().required(),
    route: Joi.string().required(),
    props: Joi.object({
      _id: Joi.string().required(),
      _component: Joi.string().required(),
      _children: Joi.array().required(),
      _instanceName: Joi.string().required(),
      _styles: Joi.object().required(),
      type: Joi.string().optional(),
      table: Joi.string().optional(),
    }).required().unknown(true),
  }).unknown(true))
}

router.post(
  "/api/pages/:pageId",
  authorized(BUILDER),
  generateSaveValidation(),
  controller.save
)

module.exports = router
