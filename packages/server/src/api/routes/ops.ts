import { middleware } from "@budibase/backend-core"
import Router from "@koa/router"
import Joi from "joi"
import * as controller from "../controllers/ops"

export function logsValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      message: Joi.string().required(),
      data: Joi.object(),
    })
  )
}

export function errorValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      message: Joi.string().required(),
    })
  )
}

const router: Router = new Router()

router
  .post("/api/ops/log", logsValidator(), controller.log)
  .post("/api/ops/error", errorValidator(), controller.error)
  .post("/api/ops/alert", errorValidator(), controller.alert)

export default router
