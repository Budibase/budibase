const Router = require("@koa/router")
const controller = require("../controllers/accesslevel")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")

const router = Router()

router
  .post("/api/accesslevels", authorized(BUILDER), controller.create)
  .put("/api/accesslevels", authorized(BUILDER), controller.update)
  .get("/api/accesslevels", authorized(BUILDER), controller.fetch)
  .get("/api/accesslevels/:levelId", authorized(BUILDER), controller.find)
  .delete(
    "/api/accesslevels/:levelId/:rev",
    authorized(BUILDER),
    controller.destroy
  )
  .patch("/api/accesslevels/:levelId", authorized(BUILDER), controller.patch)

module.exports = router
