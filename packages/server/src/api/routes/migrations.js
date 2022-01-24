const Router = require("@koa/router")
const migrationsController = require("../controllers/migrations")
const router = Router()
const { internalApi } = require("@budibase/backend-core/auth")

router.post("/api/migrations/run", internalApi, migrationsController.migrate)

module.exports = router
