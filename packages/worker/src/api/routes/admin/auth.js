const Router = require("@koa/router")
const authController = require("../../controllers/admin/auth")
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
    "/api/admin/auth/:tenantId/login",
    buildAuthValidation(),
    authController.authenticate
  )
  .post(
    "/api/admin/auth/:tenantId/reset",
    buildResetValidation(),
    authController.reset
  )
  .post(
    "/api/admin/auth/:tenantId/reset/update",
    buildResetUpdateValidation(),
    authController.resetUpdate
  )
  .post("/api/admin/auth/logout", authController.logout)
  .get("/api/admin/auth/:tenantId/google", authController.googlePreAuth)
  .get("/api/admin/auth/:tenantId/google/callback", authController.googleAuth)

module.exports = router
