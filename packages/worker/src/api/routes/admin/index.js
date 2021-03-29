const Router = require("@koa/router")
const controller = require("../../controllers/admin")
const authorized = require("../../../middleware/authorized")

const router = Router()

router.post("/api/admin/users", authorized, controller.userSave)
  .delete("/api/admin/users/:email", authorized, controller.userDelete)
  .get("/api/admin/users", authorized, controller.userFetch)
  .get("/api/admin/users/:email", authorized, controller.userFind)

module.exports = router
