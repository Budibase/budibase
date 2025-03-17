import Router from "@koa/router"
import { PermissionType } from "@budibase/types"
import { middleware } from "@budibase/backend-core"
import authorized from "../../middleware/authorized"

import * as controller from "../controllers/oauth2"
import Joi from "joi"

function createOAauth2ConfigValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      url: Joi.string().required(),
      clientId: Joi.string().required(),
      clientSecret: Joi.string().required(),
    }),
    { allowUnknown: true }
  )
}

const router: Router = new Router()

router.get("/api/oauth2", authorized(PermissionType.BUILDER), controller.fetch)
router.post(
  "/api/oauth2",
  authorized(PermissionType.BUILDER),
  createOAauth2ConfigValidator(),
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

export default router
