import * as ai from "../controllers/ai"
import Router from "@koa/router"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router.post("/api/ai/tables", auth.builderOrAdmin, ai.generateTables)

export default router
