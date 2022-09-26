const Router = require("@koa/router")
const controller = require("../controllers/webhook")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")
const { webhookValidator } = require("./utils/validators")

const router = new Router()

router
  .get("/api/webhooks", authorized(BUILDER), controller.fetch)
  .put(
    "/api/webhooks",
    authorized(BUILDER),
    webhookValidator(),
    controller.save
  )
  .delete("/api/webhooks/:id/:rev", authorized(BUILDER), controller.destroy)
  .post(
    "/api/webhooks/schema/:instance/:id",
    authorized(BUILDER),
    controller.buildSchema
  )
  // this shouldn't have authorisation, right now its always public
  .post("/api/webhooks/trigger/:instance/:id", controller.trigger)

module.exports = router
