const Router = require("@koa/router")
const controller = require("../controllers/screen")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/accessLevels")

const router = Router()

router
  .get("/api/:pageId/screens", authorized(BUILDER), controller.fetch)
  .post("/api/:pageId/screens", authorized(BUILDER), controller.save)
  .delete("/api/:screenId/:revId", authorized(BUILDER), controller.destroy)

module.exports = router
