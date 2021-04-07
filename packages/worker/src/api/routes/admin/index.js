const Router = require("@koa/router")
const passport = require("@budibase/auth")
const controller = require("../../controllers/admin")
const authController = require("../../controllers/admin/auth")
const authenticated = require("../../../middleware/authenticated")

const router = Router()

router
  .post("/api/admin/users", authenticated, controller.userSave)
  .post("/api/admin/authenticate", authController.authenticate)
  .delete("/api/admin/users/:email", authenticated, controller.userDelete)
  .get("/api/admin/users", passport.authenticate("jwt"), controller.userFetch)
  .get("/api/admin/users/:email", authenticated, controller.userFind)

module.exports = router
