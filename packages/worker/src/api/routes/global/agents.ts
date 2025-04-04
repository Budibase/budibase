import Router from "@koa/router"
import * as controller from "../../controllers/global/agents"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

// need a full API for CRUD of agents, but this endpoint just assumes a single
// agent right now
router.post("/api/global/agent/chat", auth.adminOnly, controller.agentChat)
router.post("/api/global/agent/history", auth.adminOnly, controller.save)
router.delete(
  "/api/global/agent/history/:historyId",
  auth.adminOnly,
  controller.remove
)
router.get("/api/global/agent/history", auth.adminOnly, controller.fetchHistory)

export default router
