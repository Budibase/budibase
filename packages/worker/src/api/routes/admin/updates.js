const Router = require("@koa/router")
const controller = require("../../controllers/admin/updates")
const adminOnly = require("../../../middleware/adminOnly")

const router = Router()

router.get("/api/admin/update", adminOnly, controller.updateSystem)

module.exports = router
