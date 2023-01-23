import Router from "@koa/router"
import * as migrationsController from "../controllers/migrations"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router
  .post("/api/migrations/run", auth.internalApi, migrationsController.migrate)
  .get(
    "/api/migrations/definitions",
    auth.internalApi,
    migrationsController.fetchDefinitions
  )
export default router
