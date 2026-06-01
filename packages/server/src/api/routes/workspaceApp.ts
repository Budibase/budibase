import { middleware } from "@budibase/backend-core"
import { AppFontFamily, Theme } from "@budibase/types"
import Joi from "joi"

import { builderRoutes } from "./endpointGroups"
import * as controller from "../controllers/workspaceApp"

const baseSchema = {
  name: Joi.string().required(),
  url: Joi.string()
    .required()
    .regex(/^\/[\w-]*$/),
  disabled: Joi.boolean().optional(),
}

const insertSchema = Joi.object({
  ...baseSchema,
})

const updateSchema = Joi.object({
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
  ...baseSchema,
  navigation: Joi.object().required(),
  theme: Joi.string()
    .valid(...Object.values(Theme))
    .optional(),
  customTheme: Joi.object({
    buttonBorderRadius: Joi.string().optional(),
    fontFamily: Joi.string()
      .valid(...Object.values(AppFontFamily))
      .optional(),
    primaryColor: Joi.string().optional(),
    primaryColorHover: Joi.string().optional(),
    navTextColor: Joi.string().optional(),
    navBackground: Joi.string().optional(),
  }).optional(),
})

function workspaceAppValidator(
  schema: typeof insertSchema | typeof updateSchema
) {
  return middleware.joiValidator.body(schema, { allowUnknown: false })
}

builderRoutes
  .get("/api/workspaceApp", controller.fetch)
  .get("/api/workspaceApp/:id", controller.find)
  .post(
    "/api/workspaceApp",
    workspaceAppValidator(insertSchema),
    controller.create
  )
  .post("/api/workspaceApp/:id/duplicate", controller.duplicate)
  .put(
    "/api/workspaceApp/:id",
    workspaceAppValidator(updateSchema),
    controller.edit
  )
  .delete("/api/workspaceApp/:id/:rev", controller.remove)
