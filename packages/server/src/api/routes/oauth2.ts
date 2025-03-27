import Router from "@koa/router"
import {
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  PermissionType,
} from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import authorized from "../../middleware/authorized"

import * as controller from "../controllers/oauth2"
import Joi from "joi"

const baseSchema = {
  url: Joi.string().required(),
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  method: Joi.string()
    .required()
    .valid(...Object.values(OAuth2CredentialsMethod)),
  grantType: Joi.string()
    .required()
    .valid(...Object.values(OAuth2GrantType)),
}

const insertSchema = Joi.object({
  name: Joi.string().required(),
  ...baseSchema,
})

const updateSchema = Joi.object({
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
  name: Joi.string().required(),
  ...baseSchema,
})

const validationSchema = Joi.object({
  _id: Joi.string(),
  ...baseSchema,
})

function oAuth2ConfigValidator(
  schema: typeof validationSchema | typeof insertSchema | typeof updateSchema
) {
  return middleware.joiValidator.body(schema, { allowUnknown: false })
}

const router: Router = new Router()

router.get("/api/oauth2", authorized(PermissionType.BUILDER), controller.fetch)
router.post(
  "/api/oauth2",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidator(insertSchema),
  controller.create
)
router.put(
  "/api/oauth2/:id",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidator(updateSchema),
  controller.edit
)
router.delete(
  "/api/oauth2/:id/:rev",
  authorized(PermissionType.BUILDER),
  controller.remove
)
router.post(
  "/api/oauth2/validate",
  authorized(PermissionType.BUILDER),
  oAuth2ConfigValidator(validationSchema),
  controller.validate
)

export default router
