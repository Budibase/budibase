import Router from "@koa/router"
import * as authController from "../../controllers/global/auth"
import { auth } from "@budibase/backend-core"
import Joi from "joi"

const router: Router = new Router()

function buildAuthValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(false))
}

function buildResetValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    email: Joi.string().required(),
  }).required().unknown(false))
}

function buildResetUpdateValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    resetCode: Joi.string().required(),
    password: Joi.string().required(),
  }).required().unknown(false))
}

router
  // PASSWORD
  .post(
    "/api/global/auth/:tenantId/login",
    buildAuthValidation(),
    authController.login
  )
  .post("/api/global/auth/logout", authController.logout)
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
  // INIT
  .post("/api/global/auth/init", authController.setInitInfo)
  .get("/api/global/auth/init", authController.getInitInfo)

  // DATASOURCE - MULTI TENANT
  .get(
    "/api/global/auth/:tenantId/datasource/:provider",
    authController.datasourcePreAuth
  )
  .get(
    "/api/global/auth/:tenantId/datasource/:provider/callback",
    authController.datasourceAuth
  )

  // DATASOURCE - SINGLE TENANT - DEPRECATED
  .get(
    "/api/global/auth/datasource/:provider/callback",
    authController.datasourceAuth
  )

  // GOOGLE - MULTI TENANT
  .get("/api/global/auth/:tenantId/google", authController.googlePreAuth)
  .get(
    "/api/global/auth/:tenantId/google/callback",
    authController.googleCallback
  )

  // GOOGLE - SINGLE TENANT - DEPRECATED
  .get("/api/global/auth/google/callback", authController.googleCallback)
  .get("/api/admin/auth/google/callback", authController.googleCallback)

  // OIDC - MULTI TENANT
  .get(
    "/api/global/auth/:tenantId/oidc/configs/:configId",
    authController.oidcPreAuth
  )
  .get("/api/global/auth/:tenantId/oidc/callback", authController.oidcCallback)

  // OIDC - SINGLE TENANT - DEPRECATED
  .get("/api/global/auth/oidc/callback", authController.oidcCallback)
  .get("/api/admin/auth/oidc/callback", authController.oidcCallback)

export default router
