const Router = require("@koa/router")
const authController = require("../../controllers/global/auth")
const joiValidator = require("../../../middleware/joi-validator")
const Joi = require("joi")

const router = Router()

function buildAuthValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(false))
}

function buildResetValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    email: Joi.string().required(),
  }).required().unknown(false))
}

function buildResetUpdateValidation() {
  // prettier-ignore
  return joiValidator.body(Joi.object({
    resetCode: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(false))
}

router
  .post(
    "/api/global/auth/:tenantId/login",
    buildAuthValidation(),
    authController.authenticate
  )
  .post(
    "/api/global/auth/:tenantId/reset",
    buildResetValidation(),
    authController.reset
  )
  .post(
    "/api/global/auth/:tenantId/reset/update",
    buildResetUpdateValidation(),
    authController.resetUpdate
  )
  .post("/api/global/auth/logout", authController.logout)
  .get("/api/global/auth/:tenantId/google", authController.googlePreAuth)
  .get("/api/global/auth/:tenantId/google/callback", authController.googleAuth)
  .get(
    "/api/global/auth/:tenantId/oidc/configs/:configId",
    authController.oidcPreAuth
  )
  .get("/api/global/auth/:tenantId/oidc/callback", authController.oidcAuth)

module.exports = router
