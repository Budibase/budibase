import * as ai from "../controllers/ai"
import { auth } from "@budibase/backend-core"
import { middleware } from "@budibase/pro"
import {
  chatAgentValidator,
  createToolSourceValidator,
  updateToolSourceValidator,
} from "./utils/validators/agent"
import { EndpointGroup } from "../utils"
import Router from "@koa/router"
const builderAdminGroup = new EndpointGroup()
const licensedGroup = new EndpointGroup()

builderAdminGroup.addGroupMiddleware(auth.builderOrAdmin)
licensedGroup.addGroupMiddleware(middleware.licenseAuth)

builderAdminGroup
  .post("/api/ai/tables", ai.generateTables)
  .post("/api/agent/chat", chatAgentValidator(), ai.agentChat)
  .post("/api/agent/chat", ai.agentChat)
  .post("/api/agent/chat/stream", ai.agentChatStream)
  .delete("/api/agent/history/:historyId", ai.remove)
  .get("/api/agent/history", ai.fetchHistory)
  .post(
    "/api/agent/toolsource",
    createToolSourceValidator(),
    ai.createToolSource
  )
  .put(
    "/api/agent/toolsource",

    updateToolSourceValidator(),
    ai.updateToolSource
  )
  .delete(
    "/api/agent/toolsource/:toolSourceId",

    ai.deleteToolSource
  )
  .get("/api/agent/toolsource", ai.fetchToolSources)

  .post("/api/ai/cron", ai.generateCronExpression)
  .post("/api/ai/js", ai.generateJs)

licensedGroup
  .post("/api/ai/chat", ai.chatCompletion)
  .post("/api/ai/upload-file", ai.uploadFile)

const router: Router = new Router()
builderAdminGroup.apply(router)
licensedGroup.apply(router)

export default router
