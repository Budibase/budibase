import * as ai from "../controllers/ai"
import Router from "@koa/router"
import { auth } from "@budibase/backend-core"
import { middleware } from "@budibase/pro"
import {
  chatAgentValidator,
  createToolSourceValidator,
  updateToolSourceValidator,
} from "./utils/validators/agent"

const router: Router = new Router()

router.post("/api/ai/tables", auth.builderOrAdmin, ai.generateTables)

router.post(
  "/api/agent/chat",
  auth.builderOrAdmin,
  chatAgentValidator(),
  ai.agentChat
)
router.post("/api/agent/chat", auth.builderOrAdmin, ai.agentChat)
router.post("/api/agent/chat/stream", auth.builderOrAdmin, ai.agentChatStream)
router.delete("/api/agent/history/:historyId", auth.builderOrAdmin, ai.remove)
router.get("/api/agent/history", auth.builderOrAdmin, ai.fetchHistory)
router.post(
  "/api/agent/toolsource",
  auth.builderOrAdmin,
  createToolSourceValidator(),
  ai.createToolSource
)
router.put(
  "/api/agent/toolsource",
  auth.builderOrAdmin,
  updateToolSourceValidator(),
  ai.updateToolSource
)
router.delete(
  "/api/agent/toolsource/:toolSourceId",
  auth.builderOrAdmin,
  ai.deleteToolSource
)
router.get("/api/agent/toolsource", auth.builderOrAdmin, ai.fetchToolSources)

router.post("/api/ai/cron", auth.builderOrAdmin, ai.generateCronExpression)
router.post("/api/ai/js", auth.builderOrAdmin, ai.generateJs)
router.post("/api/ai/chat", middleware.licenseAuth, ai.chatCompletion)
router.post("/api/ai/upload-file", middleware.licenseAuth, ai.uploadFile)

export default router
