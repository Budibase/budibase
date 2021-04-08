const Router = require("@koa/router")
const controller = require("../../controllers/admin")
const authenticated = require("../../../middleware/authenticated")

const router = Router()

router
  .post("/api/admin/users", authenticated, controller.userSave)
  .delete("/api/admin/users/:email", authenticated, controller.userDelete)
  .get("/api/admin/users", authenticated, controller.userFetch)
  .get("/api/admin/users/:email", authenticated, controller.userFind)

module.exports = router
