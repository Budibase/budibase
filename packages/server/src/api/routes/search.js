const Router = require("@koa/router")
const controller = require("../controllers/search")

const router = Router()

router.get("/api/search/rows", controller.rowSearch)

module.exports = router
