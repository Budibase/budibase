import { auth } from "@budibase/backend-core"
import Router from "@koa/router"
import * as migrationsController from "../controllers/migrations"

const router: Router = new Router()

router
  .post("/api/migrations/run", auth.internalApi, migrationsController.migrate)
  .get(
    "/api/migrations/definitions",
    auth.internalApi,
    migrationsController.fetchDefinitions
  )
  .get("/api/migrations/status", migrationsController.getMigrationStatus)

export default router
