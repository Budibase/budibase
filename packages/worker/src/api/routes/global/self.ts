const Router = require("@koa/router")
const controller = require("../../controllers/global/self")
const { builderOnly } = require("@budibase/backend-core/auth")
const { users } = require("../validation")

const router = Router()

router
  .post("/api/global/self/api_key", builderOnly, controller.generateAPIKey)
  .get("/api/global/self/api_key", builderOnly, controller.fetchAPIKey)
  .get("/api/global/self", controller.getSelf)
  .post(
    "/api/global/self",
    users.buildUserSaveValidation(true),
    controller.updateSelf
  )

module.exports = router
