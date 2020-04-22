const Router = require("@koa/router")
const controller = require("../../controllers/record")

const router = Router()

router
  .get("/api/:instanceId/:modelId/records", controller.fetch)
  .get("/api/:instanceId/records/:recordId", controller.find)
  .post("/api/:instanceId/records", controller.save)
  .delete("/api/:instanceId/records/:recordId/:revId", controller.destroy)

module.exports = router
