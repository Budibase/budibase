const Router = require("@koa/router")
const controller = require("../controllers/backup")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router.get("/api/backups/export", authorized(BUILDER), controller.exportAppDump)
// .get(
//   "/api/backups/download/:fileName",
//   authorized(BUILDER),
//   controller.downloadAppDump
// )

module.exports = router
