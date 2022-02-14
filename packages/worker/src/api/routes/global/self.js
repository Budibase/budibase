const Router = require("@koa/router")
const controller = require("../../controllers/global/self")
const builderOnly = require("../../../middleware/builderOnly")
const { buildUserSaveValidation } = require("../../utilities/validation")

const router = Router()

router
  .post("/api/global/self/api_key", builderOnly, controller.generateAPIKey)
  .get("/api/global/self/api_key", builderOnly, controller.fetchAPIKey)
  .get("/api/global/self", controller.getSelf)
  .post(
    "/api/global/self",
    buildUserSaveValidation(true),
    controller.updateSelf
  )

module.exports = router
