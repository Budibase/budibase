import Router from "@koa/router"
import { PermissionType } from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import authorized from "../../middleware/authorized"

import * as controller from "../controllers/workspaceApp"
import Joi from "joi"

const baseSchema = {
  name: Joi.string().required(),
  url: Joi.string()
    .required()
    .regex(/^\/\w*$/),
  icon: Joi.string().required(),
  iconColor: Joi.string().optional(),
}

const insertSchema = Joi.object({
  ...baseSchema,
})

const updateSchema = Joi.object({
  _id: Joi.string().required(),
  _rev: Joi.string().required(),
  ...baseSchema,
  navigation: Joi.object().required(),
})

function workspaceAppValidator(
  schema: typeof insertSchema | typeof updateSchema
) {
  return middleware.joiValidator.body(schema, { allowUnknown: false })
}

const router: Router = new Router()

router.get(
  "/api/workspaceApp",
  authorized(PermissionType.BUILDER),
  controller.fetch
)
router.post(
  "/api/workspaceApp",
  authorized(PermissionType.BUILDER),
  workspaceAppValidator(insertSchema),
  controller.create
)
router.put(
  "/api/workspaceApp/:id",
  authorized(PermissionType.BUILDER),
  workspaceAppValidator(updateSchema),
  controller.edit
)
router.delete(
  "/api/workspaceApp/:id/:rev",
  authorized(PermissionType.BUILDER),
  controller.remove
)

export default router
