const Router = require("@koa/router")
const controller = require("../../controllers/admin/configs")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")
const { Configs, ConfigUploads } = require("../../../constants")

const router = Router()

function smtpValidation() {
  // prettier-ignore
  return Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
    from: Joi.string().email().required(),
    secure: Joi.boolean().optional(),
    selfSigned: Joi.boolean().optional(),
    auth: Joi.object({
      type: Joi.string().valid("login", "oauth2", null),
      user: Joi.string().required(),
      pass: Joi.string().allow("", null),
    }).optional(),
  }).unknown(true)
}

function settingValidation() {
  // prettier-ignore
  return Joi.object({
    platformUrl: Joi.string().valid("", null),
    logoUrl: Joi.string().valid("", null),
    docsUrl: Joi.string().valid("", null),
    company: Joi.string().required(),
  }).unknown(true)
}

function googleValidation() {
  // prettier-ignore
  return Joi.object({
    clientID: Joi.string().required(),
    clientSecret: Joi.string().required(),
    callbackURL: Joi.string().required(),
  }).unknown(true)
}

function buildConfigSaveValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    _id: Joi.string(),
    _rev: Joi.string(),
    group: Joi.string(),
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
    }).required(),
  )
}

function buildUploadValidation() {
  // prettier-ignore
  return joiValidator.params(Joi.object({
    type: Joi.string().valid(...Object.values(Configs)).required(),
    name: Joi.string().valid(...Object.values(ConfigUploads)).required(),
  }).required())
}

function buildConfigGetValidation() {
  // prettier-ignore
  return joiValidator.params(Joi.object({
    type: Joi.string().valid(...Object.values(Configs)).required()
  }).unknown(true).required())
}

router
  .post("/api/admin/configs", buildConfigSaveValidation(), controller.save)
  .delete("/api/admin/configs/:id", controller.destroy)
  .get("/api/admin/configs", controller.fetch)
  .get("/api/admin/configs/checklist", controller.configChecklist)
  .get(
    "/api/admin/configs/all/:type",
    buildConfigGetValidation(),
    controller.fetch
  )
  .get("/api/admin/configs/:type", buildConfigGetValidation(), controller.find)
  .post(
    "/api/admin/configs/upload/:type/:name",
    buildUploadValidation(),
    controller.upload
  )

module.exports = router
