import Router from "@koa/router"
import * as migrationsController from "../controllers/migrations"

const router: Router = new Router()

router.get("/api/migrations/status", migrationsController.getMigrationStatus)

export default router
