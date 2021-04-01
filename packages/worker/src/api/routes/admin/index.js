const Router = require("@koa/router")
const controller = require("../../controllers/admin")
const authController = require("../../controllers/admin/auth")
const authorized = require("../../../middleware/authorized")

const router = Router()

router
  .post("/api/admin/users", authorized, controller.userSave)
  .post("/api/admin/authenticate", authController.authenticate)
  .delete("/api/admin/users/:email", authorized, controller.userDelete)
  .get("/api/admin/users", authorized, controller.userFetch)
  .get("/api/admin/users/:email", authorized, controller.userFind)

module.exports = router
