const Router = require("@koa/router")
const authController = require("../../controllers/global/auth")
const { joiValidator } = require("@budibase/backend-core/auth")
const Joi = require("joi")
const { updateTenantId } = require("@budibase/backend-core/tenancy")

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

function updateTenant(ctx, next) {
  if (ctx.params) {
    updateTenantId(ctx.params.tenantId)
  }
  return next()
}

router
  .post(
    "/api/global/auth/:tenantId/login",
    buildAuthValidation(),
    updateTenant,
    authController.authenticate
  )
  .post(
    "/api/global/auth/:tenantId/reset",
    buildResetValidation(),
    updateTenant,
    authController.reset
  )
  .post(
    "/api/global/auth/:tenantId/reset/update",
    buildResetUpdateValidation(),
    updateTenant,
    authController.resetUpdate
  )
  .post("/api/global/auth/logout", authController.logout)
  .post("/api/global/auth/init", authController.setInitInfo)
  .get("/api/global/auth/init", authController.getInitInfo)
  .get(
    "/api/global/auth/:tenantId/google",
    updateTenant,
    authController.googlePreAuth
  )
  .get(
    "/api/global/auth/:tenantId/datasource/:provider",
    updateTenant,
    authController.datasourcePreAuth
  )
  // single tenancy endpoint
  .get("/api/global/auth/google/callback", authController.googleAuth)
  .get(
    "/api/global/auth/datasource/:provider/callback",
    authController.datasourceAuth
  )
  // multi-tenancy endpoint
  .get(
    "/api/global/auth/:tenantId/google/callback",
    updateTenant,
    authController.googleAuth
  )
  .get(
    "/api/global/auth/:tenantId/datasource/:provider/callback",
    updateTenant,
    authController.datasourceAuth
  )
  .get(
    "/api/global/auth/:tenantId/oidc/configs/:configId",
    updateTenant,
    authController.oidcPreAuth
  )
  // single tenancy endpoint
  .get("/api/global/auth/oidc/callback", authController.oidcAuth)
  // multi-tenancy endpoint
  .get(
    "/api/global/auth/:tenantId/oidc/callback",
    updateTenant,
    authController.oidcAuth
  )
  // deprecated - used by the default system before tenancy
  .get("/api/admin/auth/google/callback", authController.googleAuth)
  .get("/api/admin/auth/oidc/callback", authController.oidcAuth)

module.exports = router
