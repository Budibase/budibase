import { auth } from "@budibase/backend-core"
import Router from "@koa/router"
import * as migrationsController from "../../controllers/system/migrations"

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
