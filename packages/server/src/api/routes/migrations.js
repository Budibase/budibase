const Router = require("@koa/router")
const migrationsController = require("../controllers/migrations")
const router = new Router()
const { internalApi } = require("@budibase/backend-core/auth")

router
  .post("/api/migrations/run", internalApi, migrationsController.migrate)
  .get(
    "/api/migrations/definitions",
    internalApi,
    migrationsController.fetchDefinitions
  )

module.exports = router
