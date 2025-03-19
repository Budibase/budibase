import Router from "@koa/router"
import { OAuth2CredentialsMethod, PermissionType } from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import authorized from "../../middleware/authorized"

import * as controller from "../controllers/oauth2"
import Joi from "joi"

const baseValidation = {
  url: Joi.string().required(),
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  method: Joi.string()
    .required()
    .valid(...Object.values(OAuth2CredentialsMethod)),
}

function oAuth2ConfigValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      ...baseValidation,
    }),
    { allowUnknown: false }
  )
}

function oAuth2ConfigValidationValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      id: Joi.string().required(),
      ...baseValidation,
    }),
    { allowUnknown: false }
  )
}

const router: Router = new Router()

router.get("/api/oauth2", authorized(PermissionType.BUILDER), controller.fetch)
router.post(
  "/api/oauth2",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidator(),
  controller.create
)
router.put(
  "/api/oauth2/:id",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidator(),
  controller.edit
)
router.delete(
  "/api/oauth2/:id",
  authorized(PermissionType.BUILDER),
  controller.remove
)
router.post(
  "/api/oauth2/validate",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidationValidator(),
  controller.validate
)

export default router
