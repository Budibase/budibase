const Router = require("@koa/router")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const controller = require("../controllers/layout")

const router = Router()

router
  .post("/api/layouts", authorized(BUILDER), controller.save)
  .delete(
    "/api/layouts/:layoutId/:layoutRev",
    authorized(BUILDER),
    controller.destroy
  )

module.exports = router
