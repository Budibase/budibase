import Router from "@koa/router"
import * as migrationsController from "../../controllers/system/migrations"
import { auth } from "@budibase/backend-core"

const router: Router = new Router()

router
  .post(
    "/api/system/migrations/run",
    auth.internalApi,
    migrationsController.runMigrations
  )
  .get(
    "/api/system/migrations/definitions",
    auth.internalApi,
    migrationsController.fetchDefinitions
  )

export default router
