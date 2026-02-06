import * as controllers from "../../controllers/global/auditLogs"
import { Event } from "@budibase/types"
import { auth, middleware } from "@budibase/backend-core"
import Router from "@koa/router"
import Joi from "joi"

function buildAuditLogSearchValidator() {
  return auth.joiValidator.body(
    Joi.object({
      userIds: Joi.array().items(Joi.string()).optional(),
      appIds: Joi.array().items(Joi.string()).optional(),
      events: Joi.array()
        .items(Joi.string().valid(...Object.values(Event)))
        .optional(),
      startDate: Joi.string().optional().allow(""),
      endDate: Joi.string().optional().allow(""),
      fullSearch: Joi.string().optional().allow(""),
      bookmark: Joi.number(),
    })
  )
}

const router: Router = new Router()

router
  .post(
    "/api/global/auditlogs/search",
    auth.adminOnly,
    buildAuditLogSearchValidator(),
    controllers.search
  )
  .get(
    "/api/global/auditlogs/download",
    auth.adminOnly,
    // convert query string param to body
    middleware.querystringToBody,
    buildAuditLogSearchValidator(),
    controllers.download
  )
  .get(
    "/api/global/auditlogs/definitions",
    auth.adminOnly,
    controllers.definitions
  )

export default router
