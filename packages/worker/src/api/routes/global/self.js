const Router = require("@koa/router")
const controller = require("../../controllers/global/self")
const builderOnly = require("../../../middleware/builderOnly")

const router = Router()

router
  .post("/api/global/self/api_key", builderOnly, controller.generateAPIKey)
  .get("/api/global/self/api_key", builderOnly, controller.fetchAPIKey)

module.exports = router
