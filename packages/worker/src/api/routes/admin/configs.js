const Router = require("@koa/router")
const controller = require("../../controllers/admin/configs")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")
const { Configs } = require("../../../constants")

const router = Router()

function buildConfigSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    type: Joi.string().valid(...Object.values(Configs)).required(),
  }).required().unknown(true))
}

router
  .post("/api/admin/configs", buildConfigSaveValidation(), controller.save)
  .delete("/api/admin/configs/:id", controller.destroy)
  .get("/api/admin/configs", controller.fetch)
  .get("/api/admin/configs/:type", controller.find)

module.exports = router
