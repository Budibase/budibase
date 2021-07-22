const Router = require("@koa/router")
const controller = require("../../controllers/global/flags")

const router = Router()

router
  .get("/api/global/flags", controller.fetch)

module.exports = router