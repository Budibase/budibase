const Router = require("@koa/router")
const controller = require("../controllers/screen")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/:instanceId/screens", authorized(BUILDER), controller.fetch)
  .post("/api/:instanceId/screens", authorized(BUILDER), controller.save)
  .delete(
    "/api/:instanceId/:screenId/:revId",
    authorized(BUILDER),
    controller.destroy
  )

module.exports = router
