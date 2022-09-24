const Router = require("@koa/router")
const controller = require("../controllers/backup")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

router.get("/api/backups/export", authorized(BUILDER), controller.exportAppDump)

module.exports = router
