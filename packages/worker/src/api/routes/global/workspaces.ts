import Router from "@koa/router"
import * as controller from "../../controllers/global/workspaces"
import { auth } from "@budibase/backend-core"
import Joi from "joi"

const router: Router = new Router()

function buildWorkspaceSaveValidation() {
  // prettier-ignore
  return auth.joiValidator.body(Joi.object({
    _id: Joi.string().optional(),
    _rev: Joi.string().optional(),
    name: Joi.string().required(),
    users: Joi.array().required(),
    managers: Joi.array().required(),
    roles: Joi.object({
      default: Joi.string().optional(),
      app: Joi.object()
        .pattern(/.*/, Joi.string())
        .required()
        .unknown(true),
    }).unknown(true).optional(),
  }).required().unknown(true))
}

router
  .post(
    "/api/global/workspaces",
    auth.adminOnly,
    buildWorkspaceSaveValidation(),
    controller.save
  )
  .delete("/api/global/workspaces/:id", auth.adminOnly, controller.destroy)
  .get("/api/global/workspaces", controller.fetch)
  .get("/api/global/workspaces/:id", controller.find)

export default router
