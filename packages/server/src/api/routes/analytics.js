const Router = require("@koa/router")
const controller = require("../controllers/analytics")

const router = Router()

router
  .get("/api/bbtel", controller.isEnabled)
  .post("/api/bbtel/ping", controller.endUserPing)

module.exports = router
