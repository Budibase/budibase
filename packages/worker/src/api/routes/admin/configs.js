const Router = require("@koa/router")
const controller = require("../../controllers/admin/configs")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")
const { Configs } = require("../../../constants")

const router = Router()

function smtpValidation() {
  return Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
    from: Joi.string().email().required(),
    secure: Joi.boolean().optional(),
    selfSigned: Joi.boolean().optional(),
    auth: Joi.object({
      type: Joi.string().valid("login", "oauth2", null),
      user: Joi.string().required(),
      pass: Joi.string().valid("", null),
    }).optional(),
  }).unknown(true)
}

function settingValidation() {
  return Joi.object({
    url: Joi.string().valid("", null),
    logoUrl: Joi.string().valid("", null),
    company: Joi.string().required(),
  }).unknown(true)
}

function googleValidation() {
  return Joi.object({
    clientID: Joi.string().required(),
    clientSecret: Joi.string().required(),
    callbackURL: Joi.string().required(),
  }).unknown(true)
}

function buildConfigSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    type: Joi.string().valid(...Object.values(Configs)).required(),
    config: Joi.alternatives()
      .conditional("type", {
        switch: [
          { is: Configs.SMTP, then: smtpValidation() },
          { is: Configs.SETTINGS, then: settingValidation() },
          { is: Configs.ACCOUNT, then: Joi.object().unknown(true) },
          { is: Configs.GOOGLE, then: googleValidation() }
        ],
      }),
    }),
  )
}

router
  .post("/api/admin/configs", buildConfigSaveValidation(), controller.save)
  .delete("/api/admin/configs/:id", controller.destroy)
  .get("/api/admin/configs", controller.fetch)
  .get("/api/admin/configs/:type", controller.find)

module.exports = router
