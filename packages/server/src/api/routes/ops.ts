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

export function executeAutomationRunValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      queueName: Joi.string().required(),
      job: Joi.object({
        data: Joi.object().required(),
        opts: Joi.object().default({}),
        timestamp: Joi.number(),
      }).required(),
    })
  )
}

publicRoutes
  .post("/api/ops/log", logsValidator(), controller.log)
  .post("/api/ops/error", errorValidator(), controller.error)
  .post("/api/ops/alert", errorValidator(), controller.alert)
  .post(
    "/api/ops/automations/execute",
    middleware.internalApi,
    executeAutomationRunValidator(),
    controller.executeAutomationRun
  )
