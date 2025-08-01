import * as controller from "../../controllers/global/configs"
import { auth } from "@budibase/backend-core"
import Joi from "joi"
import { ConfigType } from "@budibase/types"
import { adminRoutes, loggedInRoutes } from "../endpointGroups"

function smtpValidation() {
  // prettier-ignore
  return Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
    from: Joi.string().email().required(),
    secure: Joi.boolean().optional(),
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
    platformUrl: Joi.string().optional(),
    logoUrl: Joi.string().optional().allow("", null),
    docsUrl: Joi.string().optional(),
    company: Joi.string().required(),
  }).unknown(true)
}

function googleValidation() {
  // prettier-ignore
  return Joi.object({
    clientID: Joi.string().required(),
    clientSecret: Joi.string().required(),
    activated: Joi.boolean().required(),
  }).unknown(true)
}

function oidcValidation() {
  // prettier-ignore
  return Joi.object({
    configs: Joi.array().items(
      Joi.object({
        clientID: Joi.string().required(),
        clientSecret: Joi.string().required(),
        configUrl: Joi.string().required(),
        logo: Joi.string().allow("", null),
        name: Joi.string().allow("", null),
        uuid: Joi.string().required(),
        activated: Joi.boolean().required(),
        scopes: Joi.array().optional()
      })
    ).required()
  }).unknown(true)
}

function scimValidation() {
  // prettier-ignore
  return Joi.object({
    enabled: Joi.boolean().required(),
  }).unknown(true)
}

function aiValidation() {
  // prettier-ignore
  return Joi.object().pattern(
    Joi.string(),
    Joi.object({
      provider: Joi.string().required(),
      isDefault: Joi.boolean().required(),
      name: Joi.string().required(),
      active: Joi.boolean().required(),
      baseUrl: Joi.string().optional().allow("", null),
      apiKey: Joi.string().optional(),
      defaultModel: Joi.string().optional(),
    }).required()
  )
}

function recaptchaValidation() {
  return Joi.object({
    siteKey: Joi.string().required(),
    secretKey: Joi.string().required(),
  }).required()
}

function buildConfigSaveValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    workspace: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(ConfigType)).required(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    config: Joi.alternatives()
      .conditional("type", {
        switch: [
          { is: ConfigType.SMTP, then: smtpValidation() },
          { is: ConfigType.SETTINGS, then: settingValidation() },
          { is: ConfigType.ACCOUNT, then: Joi.object().unknown(true) },
          { is: ConfigType.GOOGLE, then: googleValidation() },
          { is: ConfigType.OIDC, then: oidcValidation() },
          { is: ConfigType.SCIM, then: scimValidation() },
          { is: ConfigType.AI, then: aiValidation() },
          { is: ConfigType.RECAPTCHA, then: recaptchaValidation() },
        ],
      }),
  }).required().unknown(true),
  )
}

function buildUploadValidation() {
  // prettier-ignore
  return auth.joiValidator.params(Joi.object({
    type: Joi.string().valid(...Object.values(ConfigType)).required(),
    name: Joi.string().required(),
  }).required().unknown(true))
}

function buildConfigGetValidation() {
  // prettier-ignore
  return auth.joiValidator.params(Joi.object({
    type: Joi.string().valid(...Object.values(ConfigType)).required()
  }).required().unknown(true))
}

adminRoutes
  .post("/api/global/configs", buildConfigSaveValidation(), controller.save)
  .delete("/api/global/configs/:id/:rev", controller.destroy)
  .post(
    "/api/global/configs/upload/:type/:name",
    buildUploadValidation(),
    controller.upload
  )

loggedInRoutes
  .get("/api/global/configs/checklist", controller.configChecklist)
  .get("/api/global/configs/public", controller.publicSettings)
  .get("/api/global/configs/public/oidc", controller.publicOidc)
  .get("/api/global/configs/:type", buildConfigGetValidation(), controller.find)
