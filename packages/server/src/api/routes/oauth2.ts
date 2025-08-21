import { OAuth2CredentialsMethod, OAuth2GrantType } from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import { builderRoutes } from "./endpointGroups"

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
  scope: Joi.string().optional(),
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

builderRoutes
  .get("/api/oauth2", controller.fetch)
  .post("/api/oauth2", oAuth2ConfigValidator(insertSchema), controller.create)
  .put("/api/oauth2/:id", oAuth2ConfigValidator(updateSchema), controller.edit)
  .delete("/api/oauth2/:id/:rev", controller.remove)
  .post(
    "/api/oauth2/validate",
    oAuth2ConfigValidator(validationSchema),
    controller.validate
  )
