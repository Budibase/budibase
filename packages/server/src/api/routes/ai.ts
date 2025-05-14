import * as ai from "../controllers/ai"
import Router from "@koa/router"
import { auth } from "@budibase/backend-core"
import { middleware } from "@budibase/pro"

const router: Router = new Router()

router.post("/api/ai/tables", auth.builderOrAdmin, ai.generateTables)

router.post("/api/agent/chat", auth.adminOnly, ai.agentChat)
router.delete("/api/agent/history/:historyId", auth.adminOnly, ai.remove)
router.get("/api/agent/history", auth.adminOnly, ai.fetchHistory)

router.post("/api/ai/cron", auth.builderOrAdmin, ai.generateCronExpression)
router.post("/api/ai/js", auth.builderOrAdmin, ai.generateJs)
router.post("/api/ai/chat", middleware.licenseAuth, ai.chatCompletion)

export default router
