import Router from "@koa/router"
import Joi from "joi"
import { auth } from "@budibase/backend-core"
import * as controllers from "../controllers/environmentVariables"

const router: Router = new Router()

function buildEnvVarUpdateValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().optional(),
      production: Joi.string().required(),
      development: Joi.string().required(),
    })
  )
}

router
  .get("/api/env/variables/status", auth.builderOrAdmin, controllers.status)
  .get("/api/env/variables", auth.builderOrAdmin, controllers.fetch)
  .post(
    "/api/env/variables",
    auth.builderOrAdmin,
    buildEnvVarUpdateValidator(),
    controllers.create
  )
  .patch(
    "/api/env/variables/:varName",
    auth.builderOrAdmin,
    buildEnvVarUpdateValidator(),
    controllers.update
  )
  .delete(
    "/api/env/variables/:varName",
    auth.builderOrAdmin,
    controllers.destroy
  )

export default router
