import Router from "@koa/router"
import Joi from "joi"
import { auth, middleware } from "@budibase/backend-core"
import * as controllers from "../../controllers/global/agentConversationLogs"

function buildSearchValidator() {
  return auth.joiValidator.body(
    Joi.object({
      userIds: Joi.array().items(Joi.string()).optional(),
      appIds: Joi.array().items(Joi.string()).optional(),
      agentIds: Joi.array().items(Joi.string()).optional(),
      channelProviders: Joi.array().items(Joi.string()).optional(),
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
    "/api/global/agentlogs/search",
    auth.adminOnly,
    buildSearchValidator(),
    controllers.search
  )
  .get(
    "/api/global/agentlogs/download",
    auth.adminOnly,
    middleware.querystringToBody,
    buildSearchValidator(),
    controllers.download
  )

export default router
