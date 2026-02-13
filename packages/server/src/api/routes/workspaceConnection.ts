import {
  ApiKeyLocation,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
  WorkspaceConnectionType,
} from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import { builderRoutes } from "./endpointGroups"

import * as controller from "../controllers/workspaceConnections"
import Joi from "joi"

const basicAuthConfigSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid(RestAuthType.BASIC).required(),
  config: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
})

const bearerAuthConfigSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid(RestAuthType.BEARER).required(),
  config: Joi.object({
    token: Joi.string().required(),
  }).required(),
})

const apiKeyAuthConfigSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid("apiKey").required(),
  config: Joi.object({
    location: Joi.string()
      .valid(...Object.values(ApiKeyLocation))
      .required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
  }).required(),
})

const oauth2AuthConfigSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().allow("").required(),
  type: Joi.string().valid("oauth2").required(),
  url: Joi.string().allow("").required(),
  clientId: Joi.string().allow("").required(),
  clientSecret: Joi.string().allow("").required(),
  method: Joi.string()
    .valid(...Object.values(OAuth2CredentialsMethod))
    .required(),
  grantType: Joi.string()
    .valid(...Object.values(OAuth2GrantType))
    .required(),
  scope: Joi.string().allow("").optional(),
  audience: Joi.string().allow("").optional(),
})

const authConfigSchema = Joi.alternatives().try(
  basicAuthConfigSchema,
  bearerAuthConfigSchema,
  apiKeyAuthConfigSchema,
  oauth2AuthConfigSchema
)

const propsSchema = Joi.object({
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  query: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  staticVariables: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
})

const insertSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(WorkspaceConnectionType))
    .required(),
  templateId: Joi.string().optional(),
  templateVersion: Joi.string().optional(),
  baseUrl: Joi.string().optional(),
  auth: Joi.array().items(authConfigSchema).required(),
  props: propsSchema.required(),
})

const updateSchema = insertSchema.keys({
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
})

function connectionValidator(
  schema: typeof insertSchema | typeof updateSchema
) {
  return middleware.joiValidator.body(schema, { allowUnknown: false })
}

builderRoutes
  .get("/api/workspace/connections", controller.fetch)
  .post(
    "/api/workspace/connections",
    connectionValidator(insertSchema),
    controller.create
  )
  .put(
    "/api/workspace/connections/:id",
    connectionValidator(updateSchema),
    controller.edit
  )
  .delete("/api/workspace/connections/:id/:rev", controller.remove)
