import * as controller from "../controllers/ops"
import { middleware } from "@budibase/backend-core"
import { publicRoutes } from "./endpointGroups"
import Joi from "joi"

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

publicRoutes
  .post("/api/ops/log", logsValidator(), controller.log)
  .post("/api/ops/error", errorValidator(), controller.error)
  .post("/api/ops/alert", errorValidator(), controller.alert)
